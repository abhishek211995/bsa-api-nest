import { Injectable } from "@nestjs/common";
import { BreUserSubscription } from "./subscription.entity";
import { Between, FindOptionsWhere, Repository } from "typeorm";
import { ServiceException } from "src/exception/base-exception";
import {
  BuySubscriptionDto,
  GetUserSubscriptionQueries,
} from "./subscription.dto";
import { InjectRepository } from "@nestjs/typeorm";
@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(BreUserSubscription)
    private readonly subscriptionRepository: Repository<BreUserSubscription>,
  ) {}

  async buySubscription(data: BuySubscriptionDto) {
    try {
      const start_date = new Date();
      const end_date = this.addYears(start_date, 2);
      const subscription = {
        user_id: data.user_id,
        subscription_start_date: new Date(),
        subscription_end_date: end_date,
        amount_paid: data.amount,
        subscription_active: true,
        order_id: data.order_id,
      };
      this.subscriptionRepository.create(subscription);
      await this.subscriptionRepository.save(subscription);

      return subscription;
    } catch (error) {
      console.log("error", error);
      throw new ServiceException({
        message: "Failed to buy subscription",
        serviceErrorCode: "SC",
      });
    }
  }

  async getSubscriptions(queries: GetUserSubscriptionQueries) {
    try {
      const findWhere: FindOptionsWhere<BreUserSubscription> = {};

      if (queries?.user_id) {
        findWhere.user_id = Number(queries.user_id);
      }
      if (queries.is_active === "true") {
        const date = new Date();
        findWhere.subscription_end_date = Between(
          new Date(),
          this.addYears(date, 2),
        );
      }
      const result = await this.subscriptionRepository.find({
        where: findWhere,
      });
      return result;
    } catch (error) {
      throw new ServiceException({
        message: "Failed to get subscription",
        serviceErrorCode: "SC",
      });
    }
  }

  private addYears(date: Date, years: number) {
    date.setFullYear(date.getFullYear() + years);
    return date;
  }
}
