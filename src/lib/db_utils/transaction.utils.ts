import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";

export type transactionFn<Result> = (q: QueryRunner) => Promise<Result>;

@Injectable()
export default class TransactionUtil {
  constructor(private datasource: DataSource) {}
  async executeInTransaction<R = void>(
    f: transactionFn<R>,
  ): Promise<ReturnType<transactionFn<R>>> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await f(queryRunner);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw e;
    }
  }

  async executeInRLSTransaction<R = void>(
    f: transactionFn<R>,
    dataSource: DataSource,
  ): Promise<ReturnType<transactionFn<R>>> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await f(queryRunner);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw e;
    }
  }
}
