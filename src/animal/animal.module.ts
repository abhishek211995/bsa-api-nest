import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterModule } from "src/master/master.module";
import { AnimalController } from "./animal.controller";
import { BreAnimal } from "./animal.entity";
import { AnimalService } from "./animal.service";

@Module({
  imports: [TypeOrmModule.forFeature([BreAnimal]), MasterModule],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule {}
