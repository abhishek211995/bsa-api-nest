import { Module } from "@nestjs/common";
import { breederFarmService } from "./breederFarm.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreBreederFarm } from "./breederFarm.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BreBreederFarm])],
  controllers: [],
  providers: [breederFarmService],
  exports: [breederFarmService],
})
export class BreederFarm {}
