import { Module } from "@nestjs/common";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionService } from "./subscription.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreUserSubscription } from "./subscription.entity";
@Module({
  imports: [TypeOrmModule.forFeature([BreUserSubscription])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
