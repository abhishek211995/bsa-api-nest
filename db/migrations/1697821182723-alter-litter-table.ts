import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterLitterTable1697821182723 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`
    //     ALTER TABLE bre_litter_registration
    //       DROP FOREIGN KEY FK_3a4443a160c780e65ae83cf0c2e,
    //       DROP FOREIGN KEY FK_85e906894fb774e202c4b806aaf;
    //   `);

    await queryRunner.query(`
        ALTER TABLE bre_litter_registration
          CHANGE COLUMN sire_id sire_id VARCHAR(255) NULL,
          CHANGE COLUMN sire_owner_id sire_owner_id INT NULL;
          CHANGE COLUMN remarks remarks json null;
      `);

    await queryRunner.query(`
      ALTER TABLE bre_litter_registration 
        ADD CONSTRAINT FK_3a4443a160c780e65ae83cf0c2e
          FOREIGN KEY (sire_owner_id)
          REFERENCES bre_user (id),
        ADD CONSTRAINT FK_85e906894fb774e202c4b806aaf
          FOREIGN KEY (sire_id)
          REFERENCES bre_animal (animal_id);
      `);

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

    await queryRunner.query(`
      INSERT INTO bre_role_master (role_id, role_name) VALUES ('4', 'company');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE bre_company
        `);
  }
}
