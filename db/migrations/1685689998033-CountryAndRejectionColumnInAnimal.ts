import { MigrationInterface, QueryRunner } from "typeorm";

export class CountryAndRejectionColumnInAnimal1685689998033 implements MigrationInterface {
    name = 'CountryAndRejectionColumnInAnimal1685689998033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bre_animal\` ADD \`animal_country\` varchar(50) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` ADD \`animal_rejection_reason\` varchar(1000) NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bre_animal\` DROP COLUMN \`animal_rejection_reason\``);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` DROP COLUMN \`animal_country\``);
    }

}
