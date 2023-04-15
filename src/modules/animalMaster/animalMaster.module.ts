import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AnimalMasterController } from "./animalMaster.controller";
import { AnimalTypeServices } from "./animalMaster.service";
import { BreAnimalMaster } from "./animalMaster.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BreAnimalMaster])],
  controllers: [AnimalMasterController],
  providers: [AnimalTypeServices],
  exports: [AnimalTypeServices],
})
export class AnimalMasterModule {}
