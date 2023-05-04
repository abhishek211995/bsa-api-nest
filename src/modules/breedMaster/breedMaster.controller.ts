import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { AnimalBreedDto, EditAnimalBreed } from "./breedMaster.dto";
import { AnimalBreedServices } from "./breedMaster.service";
import { makeHTTPResponse } from "src/utils/httpResponse.util";

@Controller("breedMaster")
export class AnimalBreedMasterController {
  constructor(private readonly animalBreedServices: AnimalBreedServices) {}

  @Post()
  async addAnimalBreed(@Body() animalBreedDto: AnimalBreedDto) {
    try {
      const breed = await this.animalBreedServices.addAnimalBreed(
        animalBreedDto,
      );

      return makeHTTPResponse(breed);
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
  async editAnimalBreed(@Body() animalBreedDto: EditAnimalBreed) {
    try {
      const breed = await this.animalBreedServices.editAnimalBreed(
        animalBreedDto,
      );
      return makeHTTPResponse(breed);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  @Delete(":id")
  async deleteAnimalBreed(@Param("id") id: number) {
    try {
      const result = await this.animalBreedServices.deleteAnimalBreedById(id);
      return makeHTTPResponse(result);
    } catch (err) {
      throw err;
    }
  }
}
