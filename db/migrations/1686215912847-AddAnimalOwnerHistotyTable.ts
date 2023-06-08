import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnimalOwnerHistotyTable1686215912847
  implements MigrationInterface
{
  name = "AddAnimalOwnerHistotyTable1686215912847";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`bre_animal_owner_history\` (\`id\` int NOT NULL AUTO_INCREMENT, \`animal_id\` varchar(255) NOT NULL, \`owner_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_animal_owner_history\` ADD CONSTRAINT \`FK_8ccc227fdf86905d933345e8d47\` FOREIGN KEY (\`animal_id\`) REFERENCES \`bre_animal\`(\`animal_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_animal_owner_history\` ADD CONSTRAINT \`FK_0e7551aa8e14bef398c13ca0c89\` FOREIGN KEY (\`owner_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bre_animal_owner_history\` DROP FOREIGN KEY \`FK_0e7551aa8e14bef398c13ca0c89\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_animal_owner_history\` DROP FOREIGN KEY \`FK_8ccc227fdf86905d933345e8d47\``,
    );
    await queryRunner.query(`DROP TABLE \`bre_animal_owner_history\``);
  }
}
