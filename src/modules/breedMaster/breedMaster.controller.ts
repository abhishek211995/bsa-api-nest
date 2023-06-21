import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { AnimalBreedDto, EditAnimalBreed } from "./breedMaster.dto";
import { AnimalBreedServices } from "./breedMaster.service";
import { makeHTTPResponse } from "src/utils/httpResponse.util";
import { AnyFilesInterceptor } from "@nestjs/platform-express";

@Controller("breedMaster")
export class AnimalBreedMasterController {
  constructor(private readonly animalBreedServices: AnimalBreedServices) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async addAnimalBreed(
    @Body() animalBreedDto: AnimalBreedDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    try {
      const breed = await this.animalBreedServices.addAnimalBreed(
        animalBreedDto,
        files,
      );

      return makeHTTPResponse(breed, 200, "Breed added successfully");
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get()
  async getAnimalBreedByAnimalId(@Query() query: { animal_type_id: number }) {
    try {
      const breeds = await this.animalBreedServices.getAnimalBreedByAnimalType(
        query.animal_type_id,
      );

      return makeHTTPResponse(breeds);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Put()
  @UseInterceptors(AnyFilesInterceptor())
  async editAnimalBreed(
    @Body() animalBreedDto: EditAnimalBreed,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    try {
      const breed = await this.animalBreedServices.editAnimalBreed(
        animalBreedDto,
        files,
      );
      return makeHTTPResponse(breed, 200, "Breed updated successfully");
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  @Delete(":id")
  async deleteAnimalBreed(@Param("id") id: number) {
    try {
      const result = await this.animalBreedServices.deleteAnimalBreedById(id);
      return makeHTTPResponse(result, 200, "Breed deleted successfully");
    } catch (err) {
      throw err;
    }
  }
}
