import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterLitterTable1697821182723 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE bre_litter_registration 
            ADD COLUMN semen_bill VARCHAR(256),
            ADD COLUMN vet_certificate VARCHAR(256),
            ADD COLUMN is_semen boolean DEFAULT false;
        `);

    await queryRunner.query(`
            CREATE TABLE bre_company (
                company_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                user_id INT NOT NULL,
                created_at DATETIME DEFAULT now(),
                updated_at DATETIME DEFAULT now(),
                FOREIGN KEY (user_id) REFERENCES bre_user (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE bre_company
        `);
  }
}
