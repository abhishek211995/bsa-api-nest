import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBreedImageColumn1686218224059 implements MigrationInterface {
  name = "AddBreedImageColumn1686218224059";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bre_animal_breed_master\` ADD \`animal_breed_image\` varchar(500) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bre_animal_breed_master\` DROP COLUMN \`animal_breed_image\``,
    );
  }
}
