import { Body, Controller, Get, Post } from "@nestjs/common";
import { AnimalTypeDto, FarmTypeDto } from "./master.dto";
import { AnimalTypeServices, FarmTypeServices } from "./master.service";

@Controller("master")
export class MasterController {
  // Inject FarmTypeServices
  constructor(
    private readonly farmTypeServices: FarmTypeServices,
    private readonly animalTypeServices: AnimalTypeServices,
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
}
