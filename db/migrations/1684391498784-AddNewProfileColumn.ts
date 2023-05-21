import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewProfileColumn1684391498784 implements MigrationInterface {
  name = "AddNewProfileColumn1684391498784";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bre_user\` ADD COLUMN IF NOT EXISTS \`profile_pic\` varchar(250) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_user\` CHANGE \`user_address\` \`user_address\` varchar(250) NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bre_user\` CHANGE \`user_address\` \`user_address\` varchar(250) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_user\` DROP COLUMN \`profile_pic\``,
    );
  }
}
