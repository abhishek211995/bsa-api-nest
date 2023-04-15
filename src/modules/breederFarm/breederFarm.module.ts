import { Module } from "@nestjs/common";
import { BreederFarmService } from "./breederFarm.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreBreederFarm } from "./breederFarm.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BreBreederFarm])],
  controllers: [],
  providers: [BreederFarmService],
  exports: [BreederFarmService],
})
export class BreederFarm {}
