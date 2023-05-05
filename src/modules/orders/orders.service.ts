import { Injectable, Logger } from "@nestjs/common";
import Razorpay from "razorpay";
import { CreateOrderDto } from "./orders.dto";
import { ServiceException } from "src/exception/base-exception";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BreOrders } from "./orders.entity";

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
        receipt: "rec",
      });
      console.log("razorpayOrder", razorpayOrder);
      const payload = { ...body, order_id: razorpayOrder.id, receipt: "rec" };
      let order = this.orderRepository.create(payload);

      order = await this.orderRepository.save(payload);
      console.log("new order", order);

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
}
