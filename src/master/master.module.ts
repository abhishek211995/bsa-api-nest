import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterController } from "./master.controller";
import { BreAnimalBreedMaster, BreAnimalMaster, BreFarmMaster } from "./master.entity";
import { AnimalBreedServices, AnimalTypeServices, FarmTypeServices } from "./master.service";

@Module({
  imports: [TypeOrmModule.forFeature([BreFarmMaster, BreAnimalMaster,BreAnimalBreedMaster])],
  controllers: [MasterController],
  providers: [FarmTypeServices, AnimalTypeServices,AnimalBreedServices],
  exports: [FarmTypeServices, AnimalTypeServices,AnimalBreedServices],
})
export class MasterModule {}
