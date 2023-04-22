import { Body, Controller, Post } from "@nestjs/common";
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
}
