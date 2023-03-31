import { Injectable } from "@nestjs/common";
import { BreUserSubscription } from "./subscription.entity";
import { Repository } from "typeorm";
@Injectable()
export class SubscriptionService {
  constructor(
    private readonly breUsersRepository: Repository<BreUserSubscription>,
  ) {}

  getSubscription() {
    return this.breUsersRepository.find();
  }
}
