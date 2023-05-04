import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { AnimalTypeDto, EditAnimalTypePayload } from "./animalMaster.dto";
import { AnimalTypeServices } from "./animalMaster.service";
import { makeHTTPResponse } from "src/utils/httpResponse.util";

@Controller("animalMaster")
export class AnimalMasterController {
  constructor(private readonly animalTypeServices: AnimalTypeServices) {}

  // Add animal type
  @Post()
  async addAnimalType(@Body() animalTypeDto: AnimalTypeDto) {
    try {
      const animal = await this.animalTypeServices.addAnimalType(animalTypeDto);
      if (animal) {
        return {
          status: 200,
          message: "Animal type added successfully",
        };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get()
  async getAllAnimalTypes() {
    try {
      const animals = await this.animalTypeServices.getAllAnimalTypes();
      if (animals) {
        return {
          status: 200,
          message: "Animal types fetched successfully",
          data: animals,
        };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Put()
  async editAnimalType(@Body() animalTypeDto: EditAnimalTypePayload) {
    try {
      const animal = await this.animalTypeServices.editAnimalType(
        animalTypeDto,
      );

      return makeHTTPResponse(
        animal,
        HttpStatus.OK,
        "Animal type updated successfully!",
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Delete(":id")
  async deleteAnimalType(@Param("id") id: number) {
    try {
      const result = await this.animalTypeServices.deleteAnimalType(Number(id));
      return makeHTTPResponse(result);
    } catch (error) {
      throw error;
    }
  }
}
