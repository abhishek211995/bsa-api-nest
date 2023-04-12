import { Body, Controller, Get, Param } from "@nestjs/common";
import { BreederService } from "./breeder.service";
import { BreederDto } from "./breeder.dto";

@Controller("breeder")
export class BreederController {
  constructor(private readonly breederService: BreederService) {}

  @Get("getBreeder/:user_id")
  async getBreeder(@Param("user_id") userId: number) {
    try {
      console.log("params", userId);
      const res = await this.breederService.getBreeder(userId);
      console.log("res", res);
      return {
        status: 200,
        data: res,
        message: "Breeder Found Succeessfully!",
      };
    } catch (err) {
      return {
        statusCode: 400,
        message: err.message,
      };
    }
  }
}
