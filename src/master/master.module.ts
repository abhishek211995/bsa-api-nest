import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterController } from "./master.controller";
import { BreAnimalBreedMaster, BreAnimalMaster, BreCostsMaster, BreFarmMaster, BreSubscriptionsMaster } from "./master.entity";
import { AnimalBreedServices, AnimalTypeServices, CostsServices, FarmTypeServices, SubscriptionServices } from "./master.service";

@Module({
  imports: [TypeOrmModule.forFeature([BreFarmMaster, BreAnimalMaster,BreAnimalBreedMaster,BreCostsMaster,BreSubscriptionsMaster ])],
  controllers: [MasterController],
  providers: [FarmTypeServices, AnimalTypeServices,AnimalBreedServices,CostsServices,SubscriptionServices],
  exports: [FarmTypeServices, AnimalTypeServices,AnimalBreedServices],
})
export class MasterModule {}
