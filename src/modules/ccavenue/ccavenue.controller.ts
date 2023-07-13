import { Controller, Post, Body } from "@nestjs/common";
import { CCAvenueService } from "./ccavenue.service";

@Controller("ccavenue")
export class CCAvenueController {
  constructor(private readonly ccavenueService: CCAvenueService) {}

  @Post("payment-request")
  generatePaymentRequest(@Body() requestData: any): {
    paymentRequestUrl: string;
  } {
    const amount = requestData.amount;
    const orderId = requestData.orderId;

    const paymentRequestUrl = this.ccavenueService.generatePaymentRequest(
      amount,
      orderId,
    );

    return { paymentRequestUrl };
  }

  @Post("payment-response")
  handlePaymentResponse(
    @Body("encResponse") encResponse: string,
  ): Promise<any> {
    return this.ccavenueService.verifyPaymentResponse(encResponse);
  }
}
