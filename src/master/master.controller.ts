import { Body, Controller, Get, Post } from "@nestjs/common";
import { Query } from "@nestjs/common/decorators";
import { AnimalBreedDto, AnimalTypeDto, FarmTypeDto } from "./master.dto";
import {
  AnimalBreedServices,
  AnimalTypeServices,
  FarmTypeServices,
} from "./master.service";

@Controller("master")
export class MasterController {
  // Inject FarmTypeServices
  constructor(
    private readonly farmTypeServices: FarmTypeServices,
    private readonly animalTypeServices: AnimalTypeServices,
    private readonly animalBreedServices: AnimalBreedServices,
  ) {}

  // Inject AnimalTypeServices
  const;

  // Add farm
  @Post("addFarmType")
  async addFarm(@Body() farmTypeDto: FarmTypeDto) {
    try {
      const farm = await this.farmTypeServices.addFarmType(farmTypeDto);
      if (farm) {
        return {
          status: 200,
          message: "Farm added successfully",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Get all farms
  @Get("getAllFarmTypes")
  async getFarms() {
    try {
      const farms = await this.farmTypeServices.getAllFarmTypes();
      if (farms) {
        return {
          status: 200,
          message: "Farms fetched successfully",
          data: farms,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Add animal type
  @Post("addAnimalType")
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
    }
  }

  @Get("getAllAnimalTypes")
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
    }
  }

  @Post("addAnimalBreed")
  async addAnimalBreed(@Body() animalBreedDto: AnimalBreedDto) {
    try {
      const breed = await this.animalBreedServices.addAnimalBreed(
        animalBreedDto,
      );
      if (breed) {
        return {
          status: 200,
          message: "Animal breed added successfully",
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  @Get("getAnimalBreedByAnimalId")
  async getAnimalBreedByAnimalId(@Query() animal_type_id: number) {
    try {
      const breeds = await this.animalBreedServices.getAnimalBreedByAnimalType(
        animal_type_id,
      );
      if (breeds) {
        return {
          status: 200,
          message: "Animal breeds fetched successfully",
          data: breeds,
        };
      }
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return {
          status: 400,
          message: "Invalid animal type id",
        };
      }
    }
  }
}
