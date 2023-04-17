import { Module } from "@nestjs/common";
import { BreederFarmService } from "./breederFarm.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreBreederFarm } from "./breederFarm.entity";
import { DBUtilsModule } from "src/lib/db_utils/db.utils.module";

@Module({
  imports: [TypeOrmModule.forFeature([BreBreederFarm]), DBUtilsModule],
  controllers: [],
  providers: [BreederFarmService],
  exports: [BreederFarmService],
})
export class BreederFarm {}
