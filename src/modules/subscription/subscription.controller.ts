import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { makeHTTPResponse } from "src/utils/httpResponse.util";
import {
  BuySubscriptionDto,
  GetUserSubscriptionQueries,
} from "./subscription.dto";
import { SubscriptionService } from "./subscription.service";
@Controller("subscription")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post("buy")
  async buySubscription(@Body() body: BuySubscriptionDto) {
    try {
      const result = await this.subscriptionService.buySubscription(body);
      return makeHTTPResponse(result);
    } catch (error) {
      throw error;
    }
  }

  @Get("user-subscription")
  async getUserSubscription(@Query() queries: GetUserSubscriptionQueries) {
    try {
      const result = await this.subscriptionService.getSubscriptions(queries);
      return makeHTTPResponse(result);
    } catch (error) {
      throw error;
    }
  }
}
