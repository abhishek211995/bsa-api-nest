import { Body, Controller, Get, Post } from "@nestjs/common";
import { Param, Put } from "@nestjs/common/decorators";
import { CostsDto, FarmTypeDto, RoleDto, SubscriptionDto } from "./master.dto";
import {
  CostsServices,
  FarmTypeServices,
  RoleServices,
  SubscriptionServices,
} from "./master.service";

@Controller("master")
export class MasterController {
  // Inject FarmTypeServices
  constructor(
    private readonly roleServices: RoleServices,
    private readonly farmTypeServices: FarmTypeServices,
    private readonly costsServices: CostsServices,
    private readonly subscriptionServices: SubscriptionServices,
  ) {}

  // Add Roles
  @Post("addRole")
  async addRole(@Body() roleDto: RoleDto) {
    try {
      const role = await this.roleServices.addRole(roleDto);
      if (role) {
        return {
          status: 200,
          message: "Role added successfully",
        };
      } else {
        return {
          status: 500,
          message: "Error in adding role",
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  }

  // Get all roles
  @Get("getAllRoles")
  async getRoles() {
    try {
      const roles = await this.roleServices.getAllRoles();
      if (roles) {
        return {
          status: 200,
          message: "Roles fetched successfully",
          data: roles,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  @Put("updateFarmType/:farm_id")
  async updateFarmType(
    @Param("farm_id") farm_id: number,
    @Body() farmTypeDto: FarmTypeDto,
  ) {
    try {
      const farm = await this.farmTypeServices.updateFarmType(
        farm_id,
        farmTypeDto,
      );
      if (farm) {
        return {
          status: 200,
          message: "Farm updated successfully",
          data: farm,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 400,
        message: error.message,
      };
    }
  }

  @Post("addCosts")
  async addCosts(@Body() costsDto: CostsDto) {
    try {
      console.log("costs", costsDto);
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
  @Get("getCost/:id")
  async getCostById(@Param() id: number) {
    try {
      const cost = await this.costsServices.getCostById(id);
      return {
        status: 200,
        data: cost,
        message: "Cost Found Successfully!",
      };
    } catch (error) {
      return {
        status: 400,
        message: error.message,
      };
    }
  }

  @Put("updateCosts/:id")
  async updateCosts(@Body() costsDto: CostsDto, @Param() id: number) {
    try {
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
