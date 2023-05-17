import { Controller, Get, Param, Query } from "@nestjs/common";
import { BreederService } from "./breeder.service";
import { makeHTTPResponse } from "src/utils/httpResponse.util";

@Controller("breeder")
export class BreederController {
  constructor(private readonly breederService: BreederService) {}

  @Get("getBreeder")
  async getBreeder(@Query("user_id") user_id: number) {
    try {
      const res = await this.breederService.getBreeder(user_id);
      return makeHTTPResponse(res, 200, "Breeder Found Successfully!");
    } catch (err) {
      throw err;
    }
  }

  @Get()
  async getBreederList() {
    try {
      const res = await this.breederService.getBreederList();
      return makeHTTPResponse(res, 200, "Breeder List Fetched Successfully!");
    } catch (err) {
      throw err;
    }
  }
}
