import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { LitterRegistrationService } from "./litterRegistration.service";
import { makeHTTPResponse } from "src/utils/httpResponse.util";
import { ApiOperation } from "@nestjs/swagger";
import {
  ApproveLitterBody,
  LitterRegistrationBody,
} from "./litterRegistration.dto";

@Controller("litter")
export class LitterRegistrationController {
  constructor(private readonly litterService: LitterRegistrationService) {}
  @ApiOperation({
    summary: "Litter registration",
  })
  @Post("/registration")
  async addLitter(@Body() body: LitterRegistrationBody) {
    try {
      const result = await this.litterService.registerLitter(body);
      return makeHTTPResponse(result);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Get list of registered litters",
  })
  @Get()
  async getAllLitters() {
    try {
      const result = await this.litterService.getAllLitters();
      return makeHTTPResponse(result);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Get list of registered litters",
  })
  @Get("/:id")
  async getLitterDetailsById(@Param("id") id: string) {
    try {
      const result = await this.litterService.getLitterDetailsById(id);
      return makeHTTPResponse(result);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Approve litter",
  })
  @Post("/approve")
  async approveLitter(@Body() body: ApproveLitterBody) {
    try {
      const result = await this.litterService.approveLitter(
        body.id,
        body.remarks,
      );
      return makeHTTPResponse(result);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Reject litter",
  })
  @Post("/reject")
  async rejectLitter(@Body() body: ApproveLitterBody) {
    try {
      const result = await this.litterService.rejectLitter(
        body.id,
        body.remarks,
      );
      return makeHTTPResponse(result);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Sire Request for approval",
  })
  @Get("/litterDetails/:id")
  async sireLitterApproval(@Param("id") id: string) {
    try {
      const data = await this.litterService.getLitterDetailsById(id);
      return makeHTTPResponse(
        data,
        200,
        "Litter details fetched successfully!",
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Sire Approval",
  })
  @Post("/sire-approve")
  async sireApproval(@Body() id: string, remarks: Array<{ message: string }>) {
    try {
      const result = await this.litterService.sireApproval(id, remarks);
      return makeHTTPResponse(
        result,
        200,
        "Litter Approved by sire owner Successfully!",
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Sire Reject the litter",
  })
  @Post("/sire-reject")
  async sireRejectLitter(@Body() body) {
    try {
      const result = await this.litterService.sireRejection(
        body.id,
        body.remark,
        body.remarks,
      );
      return makeHTTPResponse(result);
    } catch (error) {
      throw error;
    }
  }
}
