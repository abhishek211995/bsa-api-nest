import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAnimalTag1709279103681 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE bre_animal ADD COLUMN animal_tag varchar(255)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE bre_animal DROP COLUMN animal_tag varchar(255)
        `);
  }
}
