import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterController } from "./master.controller";
import { BreAnimalMaster, BreFarmMaster } from "./master.entity";
import { AnimalTypeServices, FarmTypeServices } from "./master.service";

@Module({
  imports: [TypeOrmModule.forFeature([BreFarmMaster, BreAnimalMaster])],
  controllers: [MasterController],
  providers: [FarmTypeServices, AnimalTypeServices],
})
export class MasterModule {}
