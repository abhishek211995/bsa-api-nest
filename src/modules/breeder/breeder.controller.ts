import { Controller, Get, Param } from "@nestjs/common";
import { BreederService } from "./breeder.service";
import { makeHTTPResponse } from "src/utils/httpResponse.util";

@Controller("breeder")
export class BreederController {
  constructor(private readonly breederService: BreederService) {}

  @Get("getBreeder/:user_id")
  async getBreeder(@Param("user_id") user_id: number) {
    try {
      const res = await this.breederService.getBreeder(user_id);
      makeHTTPResponse(res);
    } catch (err) {
      throw err;
    }
  }

  @Get()
  async getBreederList() {
    try {
      const res = await this.breederService.getBreederList();
      return {
        status: 200,
        data: res,
        message: "Breeder List Found Successfully!",
      };
    } catch (err) {
      throw err;
    }
  }
}
