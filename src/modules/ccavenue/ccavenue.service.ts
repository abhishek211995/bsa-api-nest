/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import * as ccav from "../../utils/ccavutil";
import { CCAvenueResponse } from "../orders/orders.dto";
dotenv.config();

@Injectable()
export class CCAvenueService {
  private readonly apiEndpoint =
    "https://secure.ccavenue.com/transaction/transaction.do";
  private readonly merchantId = process.env.MERCHANT_ID;
  private readonly accessCode = process.env.ACCESS_CODE;
  private readonly workingKey = process.env.WORKING_KEY;

  generatePaymentRequest(
    amount: number,
    orderId: string,
    userName: string,
    address: string,
    description: string,
    redirectUrl?: string,
  ): string {
    const params = {
      merchant_id: this.merchantId,
      order_id: orderId,
      amount: amount,
      redirect_url: redirectUrl
        ? `${process.env.API_URL}/${redirectUrl}`
        : `${process.env.API_URL}/orders/complete/ccAvenue`,
      cancel_url: `${
        process.env.WEB_URL
      }/payment?order_id=${orderId}&status=CANCELLED&description=${description}${
        redirectUrl ? "&module=education" : ""
      }`,
      currency: "INR",
      language: "EN",
      billing_name: userName,
      billing_address: address,
      merchant_param1: description,
      // Include other required parameters as per CCAvenue documentation
    };

    //Generate Md5 hash for the key and then convert in base64 string
    const md5 = crypto.createHash("md5").update(this.workingKey).digest();
    const keyBase64 = Buffer.from(md5).toString("base64");

    //Initializing Vector and then convert in base64 string
    const ivBase64 = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ]).toString("base64");
    let url = "";
    Object.keys(params).forEach((k, i) => {
      if (i === 0) {
        url = url + `${k}=${params[k]}`;
      } else {
        url = url + `&${k}=${params[k]}`;
      }
    });

    const encRequest = ccav.encrypt(url, keyBase64, ivBase64);

    return `${this.apiEndpoint}?command=initiateTransaction&encRequest=${encRequest}&access_code=${this.accessCode}`;
  }

  async verifyPaymentResponse(response: {
    encResp: string;
    orderNo: string;
  }): Promise<any> {
    const output: CCAvenueResponse | Record<string, never> =
      this.redirectResponseToJson(response.encResp);
    console.log("output", output);
    return output;
  }

  private redirectResponseToJson(response) {
    if (response) {
      const md5 = crypto.createHash("md5").update(this.workingKey).digest();
      const keyBase64 = Buffer.from(md5).toString("base64");

      const ivBase64 = Buffer.from([
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
        0x0c, 0x0d, 0x0e, 0x0f,
      ]).toString("base64");
      const ccavResponse: any = ccav.decrypt(response, keyBase64, ivBase64);
      const responseArray = ccavResponse.split("&");
      const stringify = JSON.stringify(responseArray);
      const removeQ = stringify.replace(/['"]+/g, "");
      const removeS = removeQ.replace(/[[\]]/g, "");
      return removeS.split(",").reduce((o, pair) => {
        // @ts-ignore
        pair = pair.split("=");
        return (o[pair[0]] = pair[1]), o;
      }, {});
    } else {
      this.throwError("CCAvenue encrypted response");
    }
  }

  private throwError(requirement) {
    throw new Error(`${requirement} is required to perform this action`);
  }
}
