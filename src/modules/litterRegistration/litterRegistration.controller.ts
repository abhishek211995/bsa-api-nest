import { Body, Controller, Post, Query } from "@nestjs/common";
import { LitterRegistrationService } from "./litterRegistration.service";
import { makeHTTPResponse } from "src/utils/httpResponse.util";
import { ApiOperation } from "@nestjs/swagger";
import { LitterRegistrationBody } from "./litterRegistration.dto";

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
    summary: "Send OTP to sire owner",
  })
  @Post("/sendOtp")
  async sendOtpToSireOwner(
    @Query("sire_owner_id") sire_owner_id: number,
    @Query("req_username") req_username: string,
  ) {
    try {
      const result = await this.litterService.sendOtpToSireOwner(
        sire_owner_id,
        req_username,
      );
      return makeHTTPResponse(result);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Verify OTP of sire owner",
  })
  @Post("/verifyOtp")
  async verifyOtp(
    @Query("sire_owner_id") user_id: number,
    @Query("req_username") otp: number,
  ) {
    try {
      const result = await this.litterService.verifyOtp(user_id, otp);
      return makeHTTPResponse(result);
    } catch (error) {
      throw error;
    }
  }
}
