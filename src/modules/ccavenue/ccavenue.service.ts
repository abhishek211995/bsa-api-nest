import { Injectable } from "@nestjs/common";
import * as crypto from "crypto-js";

@Injectable()
export class CCAvenueService {
  private readonly apiEndpoint =
    "https://secure.ccavenue.com/transaction/transaction.do";
  private readonly merchantId = "your_merchant_id";
  private readonly accessCode = "your_access_code";
  private readonly workingKey = "your_working_key";

  generatePaymentRequest(amount: number, orderId: string): string {
    const params = {
      merchant_id: this.merchantId,
      order_id: orderId,
      amount: amount,
      redirect_url: "http://your-frontend-url.com/payment-response",
      cancel_url: "http://your-frontend-url.com/payment-cancelled",
      billing_name: "Customer Name",
      billing_address: "Customer Address",
      // Include other required parameters as per CCAvenue documentation
    };

    const encryptedData = crypto.AES.encrypt(
      Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("|"),
      this.workingKey,
    ).toString();

    return `${this.apiEndpoint}?command=initiateTransaction&encRequest=${encryptedData}&access_code=${this.accessCode}`;
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
