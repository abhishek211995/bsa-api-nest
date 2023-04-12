import { Controller, Get, Param } from "@nestjs/common";
import { BreederService } from "./breeder.service";

@Controller("breeder")
export class BreederController {
  constructor(private readonly breederService: BreederService) {}

  @Get("getBreeder/:user_id")
  async getBreeder(@Param("user_id") user_id: string) {
    try {
      const res = await this.breederService.getBreeder(user_id);
      return {
        status: 200,
        data: res,
        message: "Breeder Found Successfully!",
      };
    } catch (err) {
      throw err;
    }
  }
}
