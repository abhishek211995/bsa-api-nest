import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterController } from "./master.controller";
import {
  BreCostsMaster,
  BreFarmMaster,
  BreRoleMaster,
  BreSubscriptionsMaster,
} from "./master.entity";
import {
  CostsServices,
  FarmTypeServices,
  RoleServices,
  SubscriptionServices,
} from "./master.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BreFarmMaster,
      BreCostsMaster,
      BreSubscriptionsMaster,
      BreRoleMaster,
    ]),
  ],
  controllers: [MasterController],
  providers: [
    FarmTypeServices,
    CostsServices,
    SubscriptionServices,
    RoleServices,
  ],
  exports: [FarmTypeServices],
})
export class MasterModule {}
