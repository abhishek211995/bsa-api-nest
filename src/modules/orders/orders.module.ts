import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailModule } from "src/lib/mail/mail.module";
import { OrdersController } from "./orders.controller";
import { BreOrders } from "./orders.entity";
import { OrdersService } from "./orders.service";
import Razorpay from "razorpay";
import { CcavenueModule } from "../ccavenue/ccavenue.module";

@Module({
  imports: [TypeOrmModule.forFeature([BreOrders]), EmailModule, CcavenueModule],
  controllers: [OrdersController],
  providers: [
    {
      provide: Razorpay,
      useFactory: () =>
        new Razorpay({
          key_id: process.env.RAZORPAY_KEY,
          key_secret: process.env.RAZORPAY_SECRET,
        }),
    },
    OrdersService,
    Logger,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
