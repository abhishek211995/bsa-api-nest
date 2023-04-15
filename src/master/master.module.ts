import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterController } from "./master.controller";
import {
  BreAnimalBreedMaster,
  BreCostsMaster,
  BreFarmMaster,
  BreRoleMaster,
  BreSubscriptionsMaster,
} from "./master.entity";
import {
  AnimalBreedServices,
  CostsServices,
  FarmTypeServices,
  RoleServices,
  SubscriptionServices,
} from "./master.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BreFarmMaster,
      BreAnimalBreedMaster,
      BreCostsMaster,
      BreSubscriptionsMaster,
      BreRoleMaster,
    ]),
  ],
  controllers: [MasterController],
  providers: [
    FarmTypeServices,
    AnimalBreedServices,
    CostsServices,
    SubscriptionServices,
    RoleServices,
  ],
  exports: [FarmTypeServices, AnimalBreedServices],
})
export class MasterModule {}
