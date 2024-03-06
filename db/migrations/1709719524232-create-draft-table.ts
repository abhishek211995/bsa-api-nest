import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDraftTable1709719524232 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE bre_drafts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                draftType VARCHAR(255),
                draftValues JSON
            )
        `);
    await queryRunner.query(
      `ALTER TABLE \`bre_drafts\` ADD CONSTRAINT \`FK_defat_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bre_drafts\` DROP FOREIGN KEY \`FK_defat_user_id\``,
    );
    await queryRunner.query(`DROP TABLE \`bre_drafts\``);
  }
}
