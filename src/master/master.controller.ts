import { Body, Controller, Get, Post } from "@nestjs/common";
import { Put, Query } from "@nestjs/common/decorators";
import {
  AnimalBreedDto,
  AnimalTypeDto,
  CostsDto,
  FarmTypeDto,
  SubscriptionDto,
} from "./master.dto";
import {
  AnimalBreedServices,
  AnimalTypeServices,
  CostsServices,
  FarmTypeServices,
  SubscriptionServices,
} from "./master.service";

@Controller("master")
export class MasterController {
  // Inject FarmTypeServices
  constructor(
    private readonly farmTypeServices: FarmTypeServices,
    private readonly animalTypeServices: AnimalTypeServices,
    private readonly animalBreedServices: AnimalBreedServices,
    private readonly costsServices: CostsServices,
    private readonly subscriptionServices: SubscriptionServices,
  ) {}

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
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return {
          status: 400,
          message: "Invalid animal type id",
        };
      }
    }
  }

  @Post("addCosts")
  async addCosts(@Body() costsDto: CostsDto) {
    try {
      const costs = await this.costsServices.addCosts(costsDto);
      if (costs) {
        return {
          status: 200,
          message: "Costs added successfully",
        };
      }
    } catch (error) {
      return {
        status: 400,
        message: error.message,
      };
    }
  }

  @Get("getAllCosts")
  async getAllCosts() {
    try {
      const costs = await this.costsServices.getCosts();
      if (costs) {
        return {
          status: 200,
          message: "Costs fetched successfully",
          data: costs,
        };
      } else {
        return {
          status: 400,
          message: "No costs found",
        };
      }
    } catch (error) {
      return {
        status: 400,
        message: error.message,
      };
    }
  }

  @Put("updateCosts")
  async updateCosts(@Body() costsDto: CostsDto, id: number) {
    try {
      console.log(costsDto, id);

      const data = await this.costsServices.updateCosts(id, costsDto);
      if (data) {
        return {
          status: 200,
          message: "Costs updated successfully",
        };
      } else {
        return {
          status: 400,
          message: "No costs found",
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  }

  @Post("addSubscription")
  async addSubscription(@Body() subscriptionDto: SubscriptionDto) {
    try {
      const subscription = await this.subscriptionServices.addSubscription(
        subscriptionDto,
      );
      if (subscription) {
        return {
          status: 200,
          message: "Subscription added successfully",
        };
      } else {
        return {
          status: 400,
          message: "Error in adding subscription",
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  }

  @Get("getAllSubscriptions")
  async getAllSubscriptions() {
    try {
      const subscriptions = await this.subscriptionServices.getSubscriptions();
      if (subscriptions) {
        return {
          status: 200,
          message: "Subscriptions fetched successfully",
          data: subscriptions,
        };
      } else {
        return {
          status: 400,
          message: "No subscriptions found",
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  }
}
