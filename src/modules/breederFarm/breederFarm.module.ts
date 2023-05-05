import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DBUtilsModule } from "src/lib/db_utils/db.utils.module";
import { S3Module } from "src/lib/s3multer/s3.module";
import { BreederFarmController } from "./breederFarm.controller";
import { BreBreederFarm } from "./breederFarm.entity";
import { BreederFarmService } from "./breederFarm.service";
import { BreUser } from "../users/users.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([BreBreederFarm, BreUser]),
    DBUtilsModule,
    S3Module,
  ],
  controllers: [BreederFarmController],
  providers: [BreederFarmService],
  exports: [BreederFarmService],
})
export class BreederFarmModule {}
