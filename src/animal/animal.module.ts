import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterModule } from "src/master/master.module";
import { AnimalController } from "./animal.controller";
import { BreAnimal } from "./animal.entity";
import { AnimalService } from "./animal.service";
import { DBUtilsModule } from "src/lib/db_utils/db.utils.module";

@Module({
  imports: [TypeOrmModule.forFeature([BreAnimal]), MasterModule, DBUtilsModule],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule {}
