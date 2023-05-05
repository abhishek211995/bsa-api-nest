import { Injectable } from "@nestjs/common";
import { BreUserSubscription } from "./subscription.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { ServiceException } from "src/exception/base-exception";
import {
  BuySubscriptionDto,
  GetUserSubscriptionQueries,
} from "./subscription.dto";
@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: Repository<BreUserSubscription>,
  ) {}

  async buySubscription(data: BuySubscriptionDto) {
    try {
      const start_date = new Date();
      const end_date = this.addYears(start_date, 2);
      const subscription = {
        user_id: data.user_id,
        subscription_start_date: start_date,
        subscription_end_date: end_date,
        amount_paid: data.amount,
        subscription_active: true,
        order_id: data.order_id,
      };
      this.subscriptionRepository.create(subscription);
      await this.subscriptionRepository.save(subscription);

      return subscription;
    } catch (error) {
      throw new ServiceException({
        message: "Failed to buy subscription",
        serviceErrorCode: "SC",
      });
    }
  }

  async getSubscriptions(queries: GetUserSubscriptionQueries) {
    try {
      const findWhere: FindOptionsWhere<BreUserSubscription> = {};
      if (queries?.is_active) {
        findWhere.subscription_active = queries.is_active;
      }

      if (queries?.user_id) {
        findWhere.user_id = queries.user_id;
      }
      const result = this.subscriptionRepository.find({
        where: findWhere,
      });

      return result;
    } catch (error) {
      throw new ServiceException({
        message: "Failed to buy subscription",
        serviceErrorCode: "SC",
      });
    }
  }

  private addYears(date: Date, years: number) {
    date.setFullYear(date.getFullYear() + years);
    return date;
  }
}
