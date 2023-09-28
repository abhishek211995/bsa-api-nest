import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import {
  CompleteCCAvenueOrderDto,
  CompleteOrderDto,
  CreateOrderDto,
} from "./orders.dto";
import { makeHTTPResponse } from "src/utils/httpResponse.util";
import { CCAvenueService } from "../ccavenue/ccavenue.service";
import { Response } from "express";

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly ccAvenueService: CCAvenueService,
  ) {}

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

  @Post("ccAvenue")
  async createCCAvenueOrder(@Body() body: CreateOrderDto) {
    try {
      const order = await this.ordersService.createCCAvenueOrder(body);
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

  @Post("complete/ccAvenue")
  async completeCCAvenueOrder(
    @Body() body: CompleteCCAvenueOrderDto,
    @Res() response: Response,
  ) {
    try {
      const responseLink = await this.ordersService.completeCCAvenueOrder(body);
      console.log("responseLink", responseLink);
      // response.redirect(responseLink);
      response.writeHead(301, { Location: responseLink });
      response.end();
    } catch (error) {
      throw error;
    }
  }

  @Get("status/:id")
  async checkStatus(@Param() params: { id: string }) {
    try {
      console.log("id", params.id);
      const order = await this.ordersService.checkOrderStatus(
        Number(params.id),
      );
      return makeHTTPResponse(order, 200);
    } catch (error) {
      throw error;
    }
  }
}
