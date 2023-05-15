import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { BreederFarmService } from "./breederFarm.service";
import { CreateBreederFarmDto } from "./breederFarm.dto";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { makeHTTPResponse } from "src/utils/httpResponse.util";

@Controller("breederFarm")
export class BreederFarmController {
  constructor(private readonly breederFarmService: BreederFarmService) {}

  @Post("add-farm")
  @UseInterceptors(AnyFilesInterceptor())
  async addFarm(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: CreateBreederFarmDto,
  ) {
    try {
      const result = await this.breederFarmService.addBreederFarm(body, files);
      return makeHTTPResponse(result, 200, "Breeder Farm created successfully");
    } catch (error) {
      throw error;
    }
  }
}
