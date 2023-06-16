import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsCurrentOwnerColumn1686301946535 implements MigrationInterface {
    name = 'AddIsCurrentOwnerColumn1686301946535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bre_animal_owner_history\` ADD \`is_current_owner\` tinyint NOT NULL DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bre_animal_owner_history\` DROP COLUMN \`is_current_owner\``);
    }

}
