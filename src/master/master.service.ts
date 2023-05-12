import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CostsDto, FarmTypeDto, RoleDto, SubscriptionDto } from "./master.dto";
import { BreCostsMaster, BreFarmMaster, BreRoleMaster } from "./master.entity";

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
    return this.breFarmMasterRepository.find({
      where: { is_deleted: false },
    });
  }
  async deleteFarmTypes(id: number) {
    const response = await this.breFarmMasterRepository.update(
      {
        farm_id: id,
      },
      {
        is_deleted: true,
      },
    );
    return response;
  }

  async updateFarmType(farm_id: number, farmTypeDto: FarmTypeDto) {
    try {
      const farm = await this.breFarmMasterRepository.find({
        where: { farm_id },
      });
      if (!farm) {
        throw new Error("Farm not found");
      }
      await this.breFarmMasterRepository.update(farm_id, farmTypeDto);
      return await this.breFarmMasterRepository.find({
        where: { farm_id },
      });
    } catch (error) {
      throw new Error(error);
    }
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
    return this.breCostsMasterRepository.find({ where: { is_deleted: false } });
  }

  async getCostById(id: any) {
    const data = await this.breCostsMasterRepository.findOne({
      where: { id },
    });
    return data;
  }

  updateCosts(id: number, costsDto: CostsDto) {
    return this.breCostsMasterRepository.update(id, costsDto);
  }

  async deleteCost(id: number) {
    const res = await this.breCostsMasterRepository.update(
      {
        id,
      },
      {
        is_deleted: true,
      },
    );

    return res;
  }
}
