import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { BreederService } from "./breeder.service";
import { CreateBreederDto } from "./breeder.dto";

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

  @Post("new")
  async createBreeder(@Body() body: CreateBreederDto) {
    try {
    } catch (error) {
      throw error;
    }
  }
}
