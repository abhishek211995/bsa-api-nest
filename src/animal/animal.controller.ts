import { Controller } from "@nestjs/common";
import { Body, Get, Post, Query } from "@nestjs/common/decorators";
import { AnimalDto, AnimalWithPedigreePayload } from "./animal.dto";
import { AnimalService } from "./animal.service";
import { ApiOperation } from "@nestjs/swagger";

@Controller("animal")
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Post("create")
  async RegisterAnimal(@Body() animalDto: AnimalDto) {
    try {
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
    } catch (error) {
      return error;
    }
  }
}
