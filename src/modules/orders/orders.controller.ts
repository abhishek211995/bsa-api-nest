import { Body, Controller, Post } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CompleteOrderDto, CreateOrderDto } from "./orders.dto";
import { makeHTTPResponse } from "src/utils/httpResponse.util";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() body: CreateOrderDto) {
    try {
      const order = await this.ordersService.createOrder(body);
      return makeHTTPResponse(order);
    } catch (error) {
      console.log("error", error);

      throw error;
    }
  }

  @Post("complete")
  async completeOrder(@Body() body: CompleteOrderDto) {
    try {
      console.log(body);
      const result = await this.ordersService.completeOrder(body);
      console.log("result", result);

      return makeHTTPResponse(result);
    } catch (error) {
      throw error;
    }
  }
}
