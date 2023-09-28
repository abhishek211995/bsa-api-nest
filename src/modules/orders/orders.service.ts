import { Injectable, Logger } from "@nestjs/common";
import Razorpay from "razorpay";
import {
  CCAvenueResponse,
  CompleteCCAvenueOrderDto,
  CompleteOrderDto,
  CreateOrderDto,
} from "./orders.dto";
import { ServiceException } from "src/exception/base-exception";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BreOrders, PaymentStatus } from "./orders.entity";
import crypto from "crypto";
import * as dotenv from "dotenv";

import { CCAvenueService } from "../ccavenue/ccavenue.service";
dotenv.config();

@Injectable()
export class OrdersService {
  //   private razorpay: Razorpay;
  constructor(
    private readonly logger: Logger,
    @InjectRepository(BreOrders)
    private readonly orderRepository: Repository<BreOrders>,
    private readonly razorpay: Razorpay,
    private readonly ccAvenueService: CCAvenueService,
  ) {}

  private getFiveDigitId(id: number) {
    const str = "" + id;
    const pad = "0000";
    const ans = pad.substring(0, pad.length - str.length) + str;
    return ans;
  }

  // deprecated
  async createOrder(body: CreateOrderDto) {
    try {
      const razorpayOrder = await this.razorpay.orders.create({
        amount: body.amount * 100,
        currency: "INR",
        receipt: "rec",
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

  async createCCAvenueOrder(body: CreateOrderDto) {
    try {
      const orderCount = await this.orderRepository.count();
      const rec = `GBA-${body.user_id}-${this.getFiveDigitId(orderCount + 1)}`;

      const payload = { ...body, order_id: rec, receipt: rec };
      let order = this.orderRepository.create(payload);

      order = await this.orderRepository.save(payload);
      const paymentLink = this.ccAvenueService.generatePaymentRequest(
        body.amount,
        order.id.toString(),
        body.user_name,
        body.billing_address,
        body.description,
      );

      return { order: order, paymentLink };
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

  // deprecated
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

  async completeCCAvenueOrder(body: CompleteCCAvenueOrderDto): Promise<string> {
    try {
      const output: CCAvenueResponse =
        await this.ccAvenueService.verifyPaymentResponse(body);
      const orderId = output.order_id;
      const paymentStatus = output.order_status;

      // Perform additional logic based on the payment status
      if (paymentStatus === "Success") {
        console.log("marking order as success");
        await this.orderRepository.update(
          { id: Number(orderId) },
          {
            method: output.payment_mode,
            status: PaymentStatus.Success,
          },
        );
      } else if (paymentStatus === "Failure") {
        console.log("marking order as failed");

        await this.orderRepository.update(
          { id: Number(orderId) },
          {
            method: output.payment_mode,
            status: PaymentStatus.Failed,
            failure_reason: output.failure_message,
          },
        );
      } else {
        // for Aborted and Invalid
        console.log("marking order as failed for aborted and invalid");

        await this.orderRepository.update(
          { id: Number(orderId) },
          {
            method: output.payment_mode,
            status: PaymentStatus.Failed,
            failure_reason: output.failure_message,
          },
        );
      }

      return `${process.env.WEB_URL}/payment?order_id=${orderId}&status=${paymentStatus}&refNo=${output.bank_ref_no}&mode=${output.payment_mode}&description=${output.merchant_param1}`;
    } catch (error) {
      this.logger.error(
        `Failed to verify order due to ${JSON.stringify(error)}`,
      );
      throw new ServiceException({
        message: "Failed to Complete order",
        serviceErrorCode: "OS",
      });
    }
  }

  async checkOrderStatus(id: number) {
    try {
      const order = await this.orderRepository.findOne({ where: { id } });
      console.log("order", order);
      if (!order) {
        throw new ServiceException({
          message: "Invalid Order Id",
          serviceErrorCode: "OS",
        });
      }
      return order;
    } catch (error) {
      throw new ServiceException({
        message: "Failed to Fetch order",
        serviceErrorCode: "OS",
      });
    }
  }
}
