import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterController } from "./master.controller";
import { BreCostsMaster, BreFarmMaster, BreRoleMaster } from "./master.entity";
import {
  CostsServices,
  FarmTypeServices,
  RoleServices,
} from "./master.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([BreFarmMaster, BreCostsMaster, BreRoleMaster]),
  ],
  controllers: [MasterController],
  providers: [FarmTypeServices, CostsServices, RoleServices],
  exports: [FarmTypeServices],
})
export class MasterModule {}
