import { Controller } from "@nestjs/common";
import {
  Body,
  Get,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common/decorators";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation } from "@nestjs/swagger";
import { S3Service } from "src/lib/s3multer/s3.service";
import {
  AnimalDto,
  AnimalWithPedigreePayload,
  ChangeAnimalStatusPayload,
  ChangeNamePayload,
} from "./animal.dto";
import { AnimalService } from "./animal.service";
import { makeHTTPResponse } from "src/utils/httpResponse.util";

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
        animal_owner_id: user_id,
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
    { animal_microchip_id }: { animal_microchip_id: string },
  ) {
    try {
      const res = await this.animalService.getAnimalAndOwner({
        animal_microchip_id,
      });
      return makeHTTPResponse(res, 200, "Animal data fetched successfully");
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Create animal with pedigree",
  })
  @Post("/create/pedigree")
  @UseInterceptors(AnyFilesInterceptor())
  async createAnimalWithPedigree(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Body() animalWithPedigree: AnimalWithPedigreePayload,
  ) {
    try {
      const result = this.animalService.createAnimalWithPedigree(
        animalWithPedigree,
        files,
      );
      return { status: 200, data: result };
    } catch (error) {
      return error;
    }
  }

  @ApiOperation({
    summary: "Get animal by id with document links",
  })
  @Get("/getAnimalById")
  async getAnimalById(@Query("id") id: string) {
    try {
      const result = await this.animalService.getAnimalById(id);
      return makeHTTPResponse(result, 200, "Animal data fetched successfully");
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  }

  @ApiOperation({
    summary: "Get animal by registration number with document links",
  })
  @Get("/getAnimalByRegNo")
  async getAnimalByRegNo(@Query("reg_no") reg_no: string) {
    try {
      const result = await this.animalService.getAnimalByRegNo(reg_no);
      return makeHTTPResponse(result, 200, "Animal data fetched successfully");
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Change name of pet",
  })
  @Post("/changeName")
  async changeName(@Body() body: ChangeNamePayload) {
    try {
      const result = await this.animalService.changeName(body);
      return makeHTTPResponse(result);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Get list of registered animals",
  })
  @Get("/registered")
  async getRegisteredAnimals() {
    try {
      const result = await this.animalService.getRegisteredAnimals();
      return makeHTTPResponse(result);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Animal Pedigree",
  })
  @Post("/import-pedigree")
  @UseInterceptors(AnyFilesInterceptor())
  async importPedigry(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Body() animalPedigreeDto: AnimalWithPedigreePayload,
  ) {
    try {
      const res = await this.animalService.importPedigree(
        animalPedigreeDto,
        files,
      );

      if (res) {
        return { status: 200, message: "Pedigree created successfully" };
      }
    } catch (error) {
      // return { status: 500, message: error.message };
      throw error;
    }
  }

  @Post("/change-status")
  async changeAnimalStatus(@Body() body: ChangeAnimalStatusPayload) {
    try {
      const result = await this.animalService.changeStatus(
        body.animal_id,
        body.status,
      );
      return makeHTTPResponse(result);
    } catch (error) {
      throw error;
    }
  }

  // Change Microchip Id
  @Put("/change-microchip-id")
  async changeMicrochipId(
    @Body() body: { animal_registration_number: string; microchip_id: string },
  ) {
    try {
      const result = await this.animalService.changeMicrochipId(
        body.animal_registration_number,
        body.microchip_id,
      );
      return makeHTTPResponse(result, 200, "Microchip Id changed successfully");
    } catch (error) {
      throw error;
    }
  }
}
