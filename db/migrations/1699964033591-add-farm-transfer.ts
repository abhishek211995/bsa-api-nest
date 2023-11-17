import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFarmTransfer1699964033591 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`bre_transfer_farm_request\` (\`transfer_id\` int NOT NULL AUTO_INCREMENT, \`request_created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`request_completed_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`request_status\` varchar(255) NOT NULL DEFAULT 'In progress', \`request_rejection_reason\` varchar(500) NULL, \`old_owner_id\` int NULL, \`new_owner_id\` int NULL, \`farm_id\` INT NULL, PRIMARY KEY (\`transfer_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_transfer_farm_request\` ADD CONSTRAINT \`FK_old_owner\` FOREIGN KEY (\`old_owner_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_transfer_farm_request\` ADD CONSTRAINT \`FK_new_owner\` FOREIGN KEY (\`new_owner_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_transfer_farm_request\` ADD CONSTRAINT \`FK_farm_id\` FOREIGN KEY (\`animal_id\`) REFERENCES \`bre_breeder_farm\`(\`farm_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bre_transfer_farm_request\` DROP FOREIGN KEY \`FK_old_owner\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_transfer_farm_request\` DROP FOREIGN KEY \`FK_new_owner\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_transfer_farm_request\` DROP FOREIGN KEY \`FK_farm_id\``,
    );
    await queryRunner.query(`DROP TABLE \`bre_transfer_farm_request\``);
  }
}
