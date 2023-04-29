import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterModule } from "src/master/master.module";
import { AnimalController } from "./animal.controller";
import { BreAnimal } from "./animal.entity";
import { AnimalService } from "./animal.service";
import { DBUtilsModule } from "src/lib/db_utils/db.utils.module";
import { S3Module } from "src/lib/s3multer/s3.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([BreAnimal]),
    MasterModule,
    DBUtilsModule,
    S3Module,
    UsersModule,
  ],
  controllers: [AnimalController],
  providers: [AnimalService],
  exports: [AnimalService],
})
export class AnimalModule {}
