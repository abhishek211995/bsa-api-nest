import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
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
      return makeHTTPResponse(result, 200, "Litter registered successfully!");
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
      console.log("get all litter");

      const result = await this.litterService.getAllLitters();
      console.log("result", result);

      return makeHTTPResponse(result, 200, "Litters fetched successfully!");
    } catch (error) {
      console.log("error", error);

      throw error;
    }
  }

  @ApiOperation({
    summary: "Get litter details by id",
  })
  @Get("/:id")
  async getLitterDetailsById(@Param("id") id: string, @Body() body) {
    try {
      const result = await this.litterService.getLitterDetailsById(id, body);
      return makeHTTPResponse(
        result,
        200,
        "Litter details fetched successfully!",
      );
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
      const result = await this.litterService.approveLitter(body);
      return makeHTTPResponse(result, 200, "Litter approved successfully!");
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
      return makeHTTPResponse(result, 200, "Litter rejected successfully!");
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Sire Request for approval",
  })
  @Get("/litterDetails/:id")
  async sireLitterApproval(@Body() body, @Param("id") id: string) {
    try {
      const data = await this.litterService.getLitterDetailsById(id, body);
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
  @Put("/sire-approve")
  async sireApproval(
    @Body() data: { id: string; remarks: Array<{ message: string }> },
  ) {
    try {
      const result = await this.litterService.sireApproval(
        data.id,
        data.remarks,
      );
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
  @Put("/sire-reject")
  async sireRejectLitter(
    @Body()
    data: {
      id: string;
      reason: string;
      remarks: Array<{ message: string }>;
    },
  ) {
    try {
      const result = await this.litterService.sireRejection({
        id: data.id,
        reason: data.reason,
        remarks: data.remarks,
      });
      return makeHTTPResponse(
        result,
        200,
        "Litter Rejected by sire owner Successfully!",
      );
    } catch (error) {
      throw error;
    }
  }
}
