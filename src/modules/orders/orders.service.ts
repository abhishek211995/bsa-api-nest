import { Injectable, Logger } from "@nestjs/common";
import Razorpay from "razorpay";
import { CompleteOrderDto, CreateOrderDto } from "./orders.dto";
import { ServiceException } from "src/exception/base-exception";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BreOrders } from "./orders.entity";
import crypto from "crypto";

@Injectable()
export class OrdersService {
  //   private razorpay: Razorpay;
  constructor(
    private readonly logger: Logger,
    @InjectRepository(BreOrders)
    private readonly orderRepository: Repository<BreOrders>,
    private readonly razorpay: Razorpay,
  ) {}

  async createOrder(body: CreateOrderDto) {
    try {
      const razorpayOrder = await this.razorpay.orders.create({
        amount: body.amount * 100,
        currency: "INR",
        receipt: "rec", // TODO: generate receipt function needs to be added here
      });

      const payload = { ...body, order_id: razorpayOrder.id, receipt: "rec" };
      let order = this.orderRepository.create(payload);

      order = await this.orderRepository.save(payload);

      return { razorpay_order: razorpayOrder, order: order };
    } catch (error) {
      console.log(
        `Failed to create order for data ${JSON.stringify(body)}`,
        error,
      );
      this.logger.error(
        `Failed to create order for data ${JSON.stringify(
          body,
        )} due to ${JSON.stringify(error)}`,
      );
      throw new ServiceException({
        message: "Failed to create order",
        serviceErrorCode: "OS",
      });
    }
  }
  async completeOrder(body: CompleteOrderDto) {
    try {
      console.log("order_id", body.order_id);

      // Fetch Order By Id
      const order = await this.orderRepository.findOne({
        where: { order_id: body.order_id },
      });

      // validate signature
      const compareStr = body.order_id + "|" + body.payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(compareStr.toString())
        .digest("hex");

      //saving the details
      if (expectedSignature === body.razorpay_signature) {
        const fetchPaymentMethod = await this.razorpay.payments.fetch(
          body.payment_id,
        );
        const res = await this.orderRepository.update(
          { order_id: order.order_id },
          {
            razorpay_order_id: body.razorpay_order_id,
            method: fetchPaymentMethod.method,
            razorpay_payment_id: body.payment_id,
            razorpay_signature: body.razorpay_signature,
          },
        );

        return { res };
      } else {
        // TODO: update order as failed
        throw new ServiceException({
          message: "Failed to Verify Signature",
          serviceErrorCode: "OS",
        });
      }
    } catch (error) {
      console.log("error", error);
      throw new ServiceException({
        message: "Failed to Complete order",
        serviceErrorCode: "OS",
      });
    }
  }
}
