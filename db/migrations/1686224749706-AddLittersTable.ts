import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLittersTable1686224749706 implements MigrationInterface {
  name = "AddLittersTable1686224749706";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`bre_litters\` (\`id\` int NOT NULL AUTO_INCREMENT, \`litter_name\` varchar(250) NOT NULL, \`litter_color_mark\` varchar(250) NOT NULL, \`litter_gender\` varchar(250) NOT NULL, \`litter_registration_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_litters\` ADD CONSTRAINT \`FK_dcef32f3955874f52c99c6ce72d\` FOREIGN KEY (\`litter_registration_id\`) REFERENCES \`bre_litter_registration\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bre_litters\` DROP FOREIGN KEY \`FK_dcef32f3955874f52c99c6ce72d\``,
    );
    await queryRunner.query(`DROP TABLE \`bre_litters\``);
  }
}
