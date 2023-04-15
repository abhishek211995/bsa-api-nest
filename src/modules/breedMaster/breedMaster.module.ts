import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreAnimalBreedMaster } from "./breedMaster.entity";
import { AnimalBreedMasterController } from "./breedMaster.controller";
import { AnimalBreedServices } from "./breedMaster.service";

@Module({
  imports: [TypeOrmModule.forFeature([BreAnimalBreedMaster])],
  controllers: [AnimalBreedMasterController],
  providers: [AnimalBreedServices],
  exports: [AnimalBreedServices],
})
export class AnimalBreedMasterModule {}
