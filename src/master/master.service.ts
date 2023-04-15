import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CostsDto, FarmTypeDto, RoleDto, SubscriptionDto } from "./master.dto";
import {
  BreCostsMaster,
  BreFarmMaster,
  BreRoleMaster,
  BreSubscriptionsMaster,
} from "./master.entity";

@Injectable()
export class RoleServices {
  constructor(
    @InjectRepository(BreRoleMaster)
    private readonly breRoleMasterRepository: Repository<BreRoleMaster>,
  ) {}

  // Add role
  addRole(roleDto: RoleDto) {
    const role = this.breRoleMasterRepository.create(roleDto);
    return this.breRoleMasterRepository.save(role);
  }

  // Get all roles
  getAllRoles() {
    return this.breRoleMasterRepository.find();
  }
}

@Injectable()
export class FarmTypeServices {
  constructor(
    @InjectRepository(BreFarmMaster)
    private readonly breFarmMasterRepository: Repository<BreFarmMaster>,
  ) {}

  // Add farm
  addFarmType(farmTypeDto: FarmTypeDto) {
    const farm = this.breFarmMasterRepository.create(farmTypeDto);
    return this.breFarmMasterRepository.save(farm);
  }

  getAllFarmTypes() {
    return this.breFarmMasterRepository.find();
  }
}

@Injectable()
export class CostsServices {
  constructor(
    @InjectRepository(BreCostsMaster)
    private readonly breCostsMasterRepository: Repository<BreCostsMaster>,
  ) {}

  addCosts(costsDto: CostsDto) {
    const cost = this.breCostsMasterRepository.create(costsDto);
    return this.breCostsMasterRepository.save(cost);
  }

  getCosts() {
    return this.breCostsMasterRepository.find();
  }
  getCostById(param: any) {
    const { id } = param;
    return this.breCostsMasterRepository.find({
      where: { id: id },
    });
  }

  updateCosts(id: number, costsDto: CostsDto) {
    return this.breCostsMasterRepository.update(id, costsDto);
  }
}

@Injectable()
export class SubscriptionServices {
  constructor(
    @InjectRepository(BreSubscriptionsMaster)
    private readonly breSubscriptionMasterRepository: Repository<BreSubscriptionsMaster>,
  ) {}

  addSubscription(subscriptionDto: SubscriptionDto) {
    const subscription =
      this.breSubscriptionMasterRepository.create(subscriptionDto);
    return this.breSubscriptionMasterRepository.save(subscription);
  }

  getSubscriptions() {
    return this.breSubscriptionMasterRepository.find();
  }
}
