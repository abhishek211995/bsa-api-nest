import { Body, Controller, Post } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./orders.dto";
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
      throw error;
    }
  }

  @Post("complete")
  async completeOrder(@Body() body) {
    try {
      console.log(body);
      makeHTTPResponse({});
    } catch (error) {
      throw error;
    }
  }
}
