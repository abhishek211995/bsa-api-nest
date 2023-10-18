import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAnimalTable1697599879895 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE bre_animal ADD COLUMN breeder_name varchar(256) DEFAULT '';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE bre_animal DROP COLUMN breeder_name
    `);
  }
}
