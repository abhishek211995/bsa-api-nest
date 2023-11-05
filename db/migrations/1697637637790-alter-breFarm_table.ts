import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBreFarmTable1697637637790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE bre_breeder_farm ADD COLUMN registration_no varchar(256) DEFAULT '';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE bre_breeder_farm DROP COLUMN registration_no
    `);
  }
}
