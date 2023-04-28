import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BreBreederFarm } from "./breederFarm.entity";
import { InsertResult, QueryRunner, Repository } from "typeorm";
import { BreederFarmDto } from "./breederFarm.dto";
import TransactionUtil from "src/lib/db_utils/transaction.utils";

JSON.stringify([1, 2]);

@Injectable()
export class BreederFarmService {
  constructor(
    @InjectRepository(BreBreederFarm)
    private breederFarmRepository: Repository<BreBreederFarm>,
    private transactionUtils: TransactionUtil,
  ) {}

  async createBreederFarm(breederFarmDto: BreederFarmDto) {
    try {
      const farmIds = JSON.parse(breederFarmDto.farm_id) as number[];

      if (farmIds.length === 0) {
        return;
      }
      const data = farmIds.map((f) => ({
        farm_id: f,
        breeder_id: breederFarmDto.breeder_id,
      }));

      const result = await this.transactionUtils.executeInTransaction(
        this.upsertFarmRelations(data),
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  upsertFarmRelations(data: { farm_id: number; breeder_id: number }[]) {
    try {
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
