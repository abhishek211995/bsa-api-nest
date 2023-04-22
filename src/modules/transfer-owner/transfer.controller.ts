import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { makeHTTPResponse } from "src/utils/httpResponse.util";
import { TransferService } from "./transfer.service";
import { TransferOwnerDto } from "./transfer.dto";

@Controller("transfer")
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post("addTransferRequest")
  async addTransferRequest(@Body() transferDto: TransferOwnerDto) {
    try {
      const transfer = await this.transferService.addRequest(transferDto);
      return makeHTTPResponse(transfer);
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
      };
    }
  }

  @Get("getTransferRequestById")
  async getTransferRequestById(@Query("request_id") id: number) {
    try {
      const transfer = await this.transferService.getRequestById(id);
      return makeHTTPResponse(transfer);
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
      };
    }
  }

  @Put("approve")
  async approveTransferRequest(@Body() data) {
    try {
      const transfer = await this.transferService.approveRequest(data);
      return makeHTTPResponse({}, HttpStatus.OK, "Transfer approved!");
    } catch (error) {
      throw error;
    }
  }

  @Put("reject")
  async rejectTransferRequest(@Body() data) {
    try {
      const transfer = await this.transferService.rejectRequest(data);
      return makeHTTPResponse({}, HttpStatus.OK, "Transfer rejected!");
    } catch (error) {
      throw error;
    }
  }
}
