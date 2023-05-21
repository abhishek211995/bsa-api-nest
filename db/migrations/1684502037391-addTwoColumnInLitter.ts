import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTwoColumnInLitter1684502037391 implements MigrationInterface {
  name = "AddTwoColumnInLitter1684502037391";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bre_litter_registration\` ADD \`sire_action_taken\` tinyint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_litter_registration\` ADD \`sire_action_time\` datetime NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bre_litter_registration\` DROP COLUMN \`sire_action_time\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_litter_registration\` DROP COLUMN \`sire_action_taken\``,
    );
  }
}
