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
import { fileFilter } from "src/utils/fileFilter.util";

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
      console.log(animalDto);

      const res = await this.animalService.createAnimal(animalDto);

      if (res) {
        // Upload image to s3
        const uploadData = await this.s3Service.uploadMultipleImages(files);
        if (uploadData) {
          const updateDoc = await this.animalService.updateAnimalDocDetails({
            animal_id: res.animal_id,
            animal_front_view_image: fileFilter(
              files,
              "animal_front_view_image",
            )[0].originalname,
            animal_left_view_image: fileFilter(
              files,
              "animal_left_view_image",
            )[0].originalname,
            animal_right_view_image: fileFilter(
              files,
              "animal_right_view_image",
            )[0].originalname,
            animal_registration_doc: fileFilter(
              files,
              "animal_registration_doc",
            )[0].originalname,
          });
          if (updateDoc) {
            return { status: 200, message: "Animal created successfully" };
          }
        }
      }
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }

  @ApiOperation({
    summary: "get all animals",
  })
  @Get("/getAnimals")
  async getAnimals(
    @Query()
    { animal_type_id, gender }: { animal_type_id: number; gender: string },
    @Body() { user }: { user: any },
  ) {
    try {
      const user_id: number = user.id;
      const res = await this.animalService.getAllAnimalByAnimalType({
        user_id,
        animal_type_id,
        gender,
      });
      console.log(res);
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
