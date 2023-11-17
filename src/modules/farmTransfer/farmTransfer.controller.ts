import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { TransferFarmDto } from "src/modules/farmTransfer/farmTransfer.dto";
import { TransferFarmService } from "src/modules/farmTransfer/farmTransfer.service";
import { ApproveRejectTransferDto } from "src/modules/transfer-owner/transfer.dto";
import { makeHTTPResponse } from "src/utils/httpResponse.util";

@Controller("transfer/farm")
export class TransferFarmController {
  constructor(private readonly transferService: TransferFarmService) {}

  @Post("addTransferRequest")
  async addTransferRequest(@Body() transferDto: TransferFarmDto) {
    try {
      const transfer = await this.transferService.addRequest(transferDto);
      return makeHTTPResponse(transfer);
    } catch (error) {
      throw error;
    }
  }

  @Get("getTransferRequestById")
  async getTransferRequestById(@Query("request_id") id: string, @Body() body) {
    try {
      const transfer = await this.transferService.getRequestById(
        id,
        body.user.id,
      );
      return makeHTTPResponse(transfer);
    } catch (error) {
      throw error;
    }
  }

  @Put("approve")
  async approveTransferRequest(@Body() body: any) {
    try {
      const transfer = await this.transferService.approveRequest(body);
      return makeHTTPResponse({}, HttpStatus.OK, "Transfer approved!");
    } catch (error) {
      throw error;
    }
  }

  @Put("reject")
  async rejectTransferRequest(@Body() data: ApproveRejectTransferDto) {
    try {
      const transfer = await this.transferService.rejectRequest(data);
      return makeHTTPResponse({}, HttpStatus.OK, "Transfer rejected!");
    } catch (error) {
      throw error;
    }
  }
}
