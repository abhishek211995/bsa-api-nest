import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreAnimalBreedMaster } from "./breedMaster.entity";
import { AnimalBreedMasterController } from "./breedMaster.controller";
import { AnimalBreedServices } from "./breedMaster.service";
import { S3Service } from "src/lib/s3multer/s3.service";

@Module({
  imports: [TypeOrmModule.forFeature([BreAnimalBreedMaster])],
  controllers: [AnimalBreedMasterController],
  providers: [AnimalBreedServices, S3Service],
  exports: [AnimalBreedServices],
})
export class AnimalBreedMasterModule {}
