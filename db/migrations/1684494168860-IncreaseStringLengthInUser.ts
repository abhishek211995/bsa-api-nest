import { MigrationInterface, QueryRunner } from "typeorm";

export class IncreaseStringLengthInUser1684494168860 implements MigrationInterface {
    name = 'IncreaseStringLengthInUser1684494168860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bre_user\` DROP COLUMN \`user_name\``);
        await queryRunner.query(`ALTER TABLE \`bre_user\` ADD \`user_name\` varchar(100) NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` DROP COLUMN \`user_country\``);
        await queryRunner.query(`ALTER TABLE \`bre_user\` ADD \`user_country\` varchar(100) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` DROP COLUMN \`identification_id_name\``);
        await queryRunner.query(`ALTER TABLE \`bre_user\` ADD \`identification_id_name\` varchar(450) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` DROP COLUMN \`identity_doc_name\``);
        await queryRunner.query(`ALTER TABLE \`bre_user\` ADD \`identity_doc_name\` varchar(450) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` DROP COLUMN \`user_address\``);
        await queryRunner.query(`ALTER TABLE \`bre_user\` ADD \`user_address\` varchar(900) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` DROP COLUMN \`profile_pic\``);
        await queryRunner.query(`ALTER TABLE \`bre_user\` ADD \`profile_pic\` varchar(450) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bre_user\` DROP COLUMN \`profile_pic\``);
        await queryRunner.query(`ALTER TABLE \`bre_user\` ADD \`profile_pic\` varchar(250) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` DROP COLUMN \`user_address\``);
        await queryRunner.query(`ALTER TABLE \`bre_user\` ADD \`user_address\` varchar(1000) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` DROP COLUMN \`identity_doc_name\``);
        await queryRunner.query(`ALTER TABLE \`bre_user\` ADD \`identity_doc_name\` varchar(250) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` DROP COLUMN \`identification_id_name\``);
        await queryRunner.query(`ALTER TABLE \`bre_user\` ADD \`identification_id_name\` varchar(250) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` DROP COLUMN \`user_country\``);
        await queryRunner.query(`ALTER TABLE \`bre_user\` ADD \`user_country\` varchar(50) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` DROP COLUMN \`user_name\``);
        await queryRunner.query(`ALTER TABLE \`bre_user\` ADD \`user_name\` varchar(50) NOT NULL DEFAULT '1'`);
    }

}
