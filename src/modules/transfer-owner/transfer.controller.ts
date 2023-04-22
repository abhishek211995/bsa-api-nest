import { Body, Controller, Get, Post, Put, Query } from "@nestjs/common";
import { TransferService } from "./transfer.service";
import { transferOwnerDto } from "./transfer.dto";
import { UsersService } from "src/modules/users/users.service";

@Controller("transfer")
export class TransferController {
  constructor(
    private readonly transferService: TransferService,
    private readonly userService: UsersService,
  ) {}

  @Post("addTransferRequest")
  async addTransferRequest(@Body() transferDto: transferOwnerDto) {
    try {
      const transfer = await this.transferService.addRequest(transferDto);
      if (transfer) {
        // get email of user by id
        const user = await this.userService.getUserById(
          transferDto.old_owner_id,
        );

        // send email to the old owner
        // await this.mailService.sendMail(user.email, user.user_name);

        return {
          statusCode: 201,
          message: "Transfer request created successfully",
        };
      }
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
      if (transfer) {
        return {
          statusCode: 200,
          message: "Transfer request fetched successfully",
          data: transfer,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
      };
    }
  }

  @Put("updateTransferRequest")
  async updateTransferRequest(@Body() data) {
    try {
      const transfer = await this.transferService.updateRequest(data);
      if (transfer !== null) {
        return {
          statusCode: 200,
          message: "Transfer request updated successfully",
        };
      } else {
        return {
          statusCode: 404,
          message: "Transfer request not found",
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
      };
    }
  }
}
