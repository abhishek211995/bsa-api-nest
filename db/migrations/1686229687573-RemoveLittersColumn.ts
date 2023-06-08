import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveLittersColumn1686229687573 implements MigrationInterface {
    name = 'RemoveLittersColumn1686229687573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` DROP COLUMN \`litters\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` ADD \`litters\` json NOT NULL`);
    }

}
