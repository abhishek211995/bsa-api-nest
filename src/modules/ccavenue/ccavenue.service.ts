import { Injectable } from "@nestjs/common";
import * as crypto from "crypto-js";
import * as ccav from "../../utils/ccavutil";
import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class CCAvenueService {
  private readonly apiEndpoint =
    "https://secure.ccavenue.com/transaction/transaction.do";
  private readonly merchantId = process.env.MERCHANT_ID;
  private readonly accessCode = process.env.ACCESS_CODE;
  private readonly workingKey = process.env.WORKING_KEY;

  generatePaymentRequest(amount: number, orderId: string): string {
    const params = {
      merchant_id: this.merchantId,
      order_id: orderId,
      amount: amount,
      redirect_url: "http://localhost:3000/payment-response",
      cancel_url: "http://localhost:3000.com/payment-cancelled",
      billing_name: "Customer Name",
      billing_address: "Customer Address",
      // Include other required parameters as per CCAvenue documentation
    };

    //Generate Md5 hash for the key and then convert in base64 string
    var md5 = crypto.MD5(this.workingKey).toString();
    var keyBase64 = Buffer.from(md5).toString("base64");

    //Initializing Vector and then convert in base64 string
    var ivBase64 = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ]).toString("base64");

    const encRequest = ccav.encrypt(
      Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("|"),
      keyBase64,
      ivBase64,
    );

    return `${this.apiEndpoint}?command=initiateTransaction&encRequest=${encRequest}&access_code=${this.accessCode}`;
  }

  async verifyPaymentResponse(encResponse: string): Promise<any> {
    const decryptedResponse = crypto.AES.decrypt(
      encResponse,
      this.workingKey,
    ).toString(crypto.enc.Utf8);

    // Parse and process the decrypted response
    const responseArray = decryptedResponse.split("&");
    const responseObj = {};

    for (const param of responseArray) {
      const [key, value] = param.split("=");
      responseObj[key] = value;
    }
    console.log(responseObj);

    //! Uncomment the following code to perform additional processing based on the payment response
    // // Now you can access the response parameters and perform further processing
    // const orderId = responseObj.order_id;
    // const paymentStatus = responseObj.order_status;
    // const paymentAmount = responseObj.amount;

    // // Perform additional logic based on the payment status
    // if (paymentStatus === 'Success') {
    //   // Payment was successful
    //   // Perform any necessary actions such as updating the order status in the database, sending notifications, etc.
    // } else if (paymentStatus === 'Failure') {
    //   // Payment failed
    //   // Handle the failure case accordingly
    // } else {
    //   // Payment status is unknown or not recognized
    //   // Handle this case as per your application's requirements
    // }

    // // Return the response object or any relevant data to the caller
    // return responseObj;
  }
}
