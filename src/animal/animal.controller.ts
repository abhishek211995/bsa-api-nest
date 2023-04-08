import { Controller } from "@nestjs/common";
import {
  Body,
  Get,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common/decorators";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ApiOperation } from "@nestjs/swagger";
import { AnimalDto, AnimalWithPedigreePayload } from "./animal.dto";
import { AnimalService } from "./animal.service";
import { Request } from "express";

@Controller("animal")
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Post("create")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "animal_front_view", maxCount: 1 },
      { name: "animal_left_view", maxCount: 1 },
      { name: "animal_right_view", maxCount: 1 },
      { name: "animal_registration_doc", maxCount: 1 },
    ]),
  )
  async RegisterAnimal(
    @Req() req: Request,
    @UploadedFiles()
    files: {
      animal_front_view?: Express.Multer.File[];
      animal_left_view?: Express.Multer.File[];
      animal_right_view?: Express.Multer.File[];
      animal_registration_doc?: Express.Multer.File[];
    },
    @Body() animalDto: AnimalDto,
  ) {
    try {
      // console.log(files);
      const { uploadMultipleImages } = req as any;

      if (
        files.animal_front_view &&
        files.animal_left_view &&
        files.animal_right_view &&
        files.animal_registration_doc
      ) {
        console.log("hi");

        uploadMultipleImages(req, (err) => {
          if (err) {
            console.log("hi", err.message);
          } else {
            // animalDto.animal_front_view_image =
            //   req.files.animal_front_view[0].location;
            // animalDto.animal_left_view_image =
            //   req.files.animal_left_view[0].location;
            // animalDto.animal_right_view_image =
            //   req.files.animal_right_view[0].location;
            // animalDto.animal_registration_doc =
            //   req.files.animal_registration_doc[0].location;
            console.log(req);
          }
        });
      }

      const res = await this.animalService.createAnimal(animalDto);
      if (res) {
        return { status: 200, message: "Animal created successfully" };
      }
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }

  // get animals of user
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
      animal_registration_no,
    }: {
      animal_microchip_id: string;
      animal_registration_no: string;
    },
  ) {
    try {
      const res = await this.animalService.getAnimalAndOwner({
        animal_microchip_id,
        animal_registration_no,
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
