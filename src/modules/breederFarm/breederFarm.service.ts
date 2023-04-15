import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BreBreederFarm } from "./breederFarm.entity";
import { InsertResult, QueryRunner, Repository } from "typeorm";
import { BreederFarmDto } from "./breederFarm.dto";

@Injectable()
export class BreederFarmService {
  constructor(
    @InjectRepository(BreBreederFarm)
    private breederFarmRepository: Repository<BreBreederFarm>,
  ) {}

  async createBreederFarm(breederFarmDto: BreederFarmDto) {
    try {
      const farmIds = breederFarmDto.farm_id
        .split(",")
        .map((i) => Number(i.trim()));
      const data = farmIds.map((f) => ({
        farm_id: f,
        breeder_id: breederFarmDto.breeder_id,
      }));
      return async function (queryRunner: QueryRunner): Promise<InsertResult> {
        const upsertResult = await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(BreBreederFarm)
          .values(data)
          .execute();
        return upsertResult;
      };
    } catch (error) {
      throw error;
    }
  }
}
