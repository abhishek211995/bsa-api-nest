import { Controller, Get } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
@Controller("subscription")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  getSubscription() {
    return this.subscriptionService.getSubscription();
  }
}
