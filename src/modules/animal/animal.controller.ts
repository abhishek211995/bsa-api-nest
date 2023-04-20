import { Controller } from "@nestjs/common";
import {
  Body,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common/decorators";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation } from "@nestjs/swagger";
import { S3Service } from "src/lib/s3multer/s3.service";
import { AnimalDto, AnimalWithPedigreePayload } from "./animal.dto";
import { AnimalService } from "./animal.service";

@Controller("animal")
export class AnimalController {
  constructor(
    private readonly animalService: AnimalService,
    private readonly s3Service: S3Service,
  ) {}

  @Post("create")
  @UseInterceptors(AnyFilesInterceptor())
  async RegisterAnimal(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Body() animalDto: AnimalDto,
  ) {
    try {
      console.log(files);

      const res = await this.animalService.createAnimal(animalDto, files);

      if (res) {
        return { status: 200, message: "Animal created successfully" };
      }
    } catch (error) {
      // return { status: 500, message: error.message };
      throw error;
    }
  }

  @ApiOperation({
    summary: "get all animals",
  })
  @Get("/getAnimals")
  async getAnimals(
    @Query()
    {
      animal_type_id,
      gender,
      user_id,
    }: {
      animal_type_id: number;
      gender: string;
      user_id: number;
    },
  ) {
    try {
      const res = await this.animalService.getAllAnimalByAnimalType({
        user_id,
        animal_type_id,
        gender,
      });
      if (res) {
        return {
          status: 200,
          message: "Animals fetched successfully",
          data: res,
        };
      }
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }

  @Get("/getAnimalAndOwner")
  async getAnimalAndOwner(
    @Query()
    {
      animal_microchip_id,
      animal_registration_number,
    }: {
      animal_microchip_id: string;
      animal_registration_number: string;
    },
  ) {
    try {
      const res = await this.animalService.getAnimalAndOwner({
        animal_microchip_id,
        animal_registration_number,
      });
      if (res) {
        return {
          status: 200,
          message: "Animal and owner details fetched successfully",
          data: res,
        };
      } else {
        return {
          status: 200,
          message: "No data found",
          data: res,
        };
      }
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }

  @ApiOperation({
    summary: "Create animal with pedigree",
  })
  @Post("/create/pedigree")
  async createAnimalWithPedigree(
    @Body() animalWithPedigree: AnimalWithPedigreePayload,
  ) {
    try {
      const result =
        this.animalService.createAnimalWithPedigree(animalWithPedigree);
      return { status: 200, data: result };
    } catch (error) {
      return error;
    }
  }
}
