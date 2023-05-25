import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTableChanges1684654130467 implements MigrationInterface {
    name = 'NewTableChanges1684654130467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bre_user\` DROP FOREIGN KEY \`FK_89d326e530743802db410fa18d6\``);
        await queryRunner.query(`ALTER TABLE \`bre_user\` CHANGE \`identity_doc_name\` \`identity_doc_name\` varchar(450) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` CHANGE \`profile_pic\` \`profile_pic\` varchar(450) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` CHANGE \`user_role_id\` \`user_role_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` DROP FOREIGN KEY \`FK_5cd1c566d6b601ae21cccb88ba3\``);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` DROP FOREIGN KEY \`FK_9e02f2b74cb340cee4258cd8a81\``);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` DROP FOREIGN KEY \`FK_6f6932fe705fa966206ace4127a\``);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_date_of_birth\` \`animal_date_of_birth\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_front_view_image\` \`animal_front_view_image\` varchar(150) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_left_view_image\` \`animal_left_view_image\` varchar(150) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_right_view_image\` \`animal_right_view_image\` varchar(150) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_registration_doc\` \`animal_registration_doc\` varchar(150) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_dna_doc\` \`animal_dna_doc\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_hded_doc\` \`animal_hded_doc\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_sire_id\` \`animal_sire_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_dam_id\` \`animal_dam_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` DROP COLUMN \`animal_pedigree\``);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` ADD \`animal_pedigree\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`registration_source\` \`registration_source\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_type_id\` \`animal_type_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_breed_id\` \`animal_breed_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_owner_id\` \`animal_owner_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_orders\` CHANGE \`failure_reason\` \`failure_reason\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_orders\` CHANGE \`failure_description\` \`failure_description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_breeder_farm\` CHANGE \`license_doc_name\` \`license_doc_name\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_breeder_farm\` CHANGE \`license_expiry_date\` \`license_expiry_date\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_breeder_farm\` CHANGE \`logo\` \`logo\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` DROP FOREIGN KEY \`FK_4745720d08c39d04ca28bcac143\``);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` DROP FOREIGN KEY \`FK_a1cf1dce27afc19057b5b7263a5\``);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` DROP FOREIGN KEY \`FK_06888907f918c48d9345dd07ef4\``);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` CHANGE \`request_rejection_reason\` \`request_rejection_reason\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` CHANGE \`old_owner_id\` \`old_owner_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` CHANGE \`new_owner_id\` \`new_owner_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` CHANGE \`animal_id\` \`animal_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` DROP COLUMN \`litters\``);
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` ADD \`litters\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` DROP COLUMN \`remarks\``);
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` ADD \`remarks\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` CHANGE \`sire_rejection_reason\` \`sire_rejection_reason\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` CHANGE \`sire_action_taken\` \`sire_action_taken\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` CHANGE \`sire_action_time\` \`sire_action_time\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` ADD CONSTRAINT \`FK_89d326e530743802db410fa18d6\` FOREIGN KEY (\`user_role_id\`) REFERENCES \`bre_role_master\`(\`role_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` ADD CONSTRAINT \`FK_5cd1c566d6b601ae21cccb88ba3\` FOREIGN KEY (\`animal_type_id\`) REFERENCES \`bre_animal_master\`(\`animal_type_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` ADD CONSTRAINT \`FK_9e02f2b74cb340cee4258cd8a81\` FOREIGN KEY (\`animal_breed_id\`) REFERENCES \`bre_animal_breed_master\`(\`animal_breed_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` ADD CONSTRAINT \`FK_6f6932fe705fa966206ace4127a\` FOREIGN KEY (\`animal_owner_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` ADD CONSTRAINT \`FK_4745720d08c39d04ca28bcac143\` FOREIGN KEY (\`old_owner_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` ADD CONSTRAINT \`FK_a1cf1dce27afc19057b5b7263a5\` FOREIGN KEY (\`new_owner_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` ADD CONSTRAINT \`FK_06888907f918c48d9345dd07ef4\` FOREIGN KEY (\`animal_id\`) REFERENCES \`bre_animal\`(\`animal_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` DROP FOREIGN KEY \`FK_06888907f918c48d9345dd07ef4\``);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` DROP FOREIGN KEY \`FK_a1cf1dce27afc19057b5b7263a5\``);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` DROP FOREIGN KEY \`FK_4745720d08c39d04ca28bcac143\``);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` DROP FOREIGN KEY \`FK_6f6932fe705fa966206ace4127a\``);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` DROP FOREIGN KEY \`FK_9e02f2b74cb340cee4258cd8a81\``);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` DROP FOREIGN KEY \`FK_5cd1c566d6b601ae21cccb88ba3\``);
        await queryRunner.query(`ALTER TABLE \`bre_user\` DROP FOREIGN KEY \`FK_89d326e530743802db410fa18d6\``);
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` CHANGE \`sire_action_time\` \`sire_action_time\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` CHANGE \`sire_action_taken\` \`sire_action_taken\` tinyint NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` CHANGE \`sire_rejection_reason\` \`sire_rejection_reason\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` DROP COLUMN \`remarks\``);
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` ADD \`remarks\` longtext COLLATE "utf8mb4_bin" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` DROP COLUMN \`litters\``);
        await queryRunner.query(`ALTER TABLE \`bre_litter_registration\` ADD \`litters\` longtext COLLATE "utf8mb4_bin" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` CHANGE \`animal_id\` \`animal_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` CHANGE \`new_owner_id\` \`new_owner_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` CHANGE \`old_owner_id\` \`old_owner_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` CHANGE \`request_rejection_reason\` \`request_rejection_reason\` varchar(500) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` ADD CONSTRAINT \`FK_06888907f918c48d9345dd07ef4\` FOREIGN KEY (\`animal_id\`) REFERENCES \`bre_animal\`(\`animal_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` ADD CONSTRAINT \`FK_a1cf1dce27afc19057b5b7263a5\` FOREIGN KEY (\`new_owner_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bre_transfer_owner_request\` ADD CONSTRAINT \`FK_4745720d08c39d04ca28bcac143\` FOREIGN KEY (\`old_owner_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bre_breeder_farm\` CHANGE \`logo\` \`logo\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_breeder_farm\` CHANGE \`license_expiry_date\` \`license_expiry_date\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_breeder_farm\` CHANGE \`license_doc_name\` \`license_doc_name\` varchar(50) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_orders\` CHANGE \`failure_description\` \`failure_description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_orders\` CHANGE \`failure_reason\` \`failure_reason\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_owner_id\` \`animal_owner_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_breed_id\` \`animal_breed_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_type_id\` \`animal_type_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`registration_source\` \`registration_source\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` DROP COLUMN \`animal_pedigree\``);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` ADD \`animal_pedigree\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_dam_id\` \`animal_dam_id\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_sire_id\` \`animal_sire_id\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_hded_doc\` \`animal_hded_doc\` varchar(50) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_dna_doc\` \`animal_dna_doc\` varchar(50) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_registration_doc\` \`animal_registration_doc\` varchar(150) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_right_view_image\` \`animal_right_view_image\` varchar(150) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_left_view_image\` \`animal_left_view_image\` varchar(150) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_front_view_image\` \`animal_front_view_image\` varchar(150) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` CHANGE \`animal_date_of_birth\` \`animal_date_of_birth\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` ADD CONSTRAINT \`FK_6f6932fe705fa966206ace4127a\` FOREIGN KEY (\`animal_owner_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` ADD CONSTRAINT \`FK_9e02f2b74cb340cee4258cd8a81\` FOREIGN KEY (\`animal_breed_id\`) REFERENCES \`bre_animal_breed_master\`(\`animal_breed_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bre_animal\` ADD CONSTRAINT \`FK_5cd1c566d6b601ae21cccb88ba3\` FOREIGN KEY (\`animal_type_id\`) REFERENCES \`bre_animal_master\`(\`animal_type_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` CHANGE \`user_role_id\` \`user_role_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` CHANGE \`profile_pic\` \`profile_pic\` varchar(450) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` CHANGE \`identity_doc_name\` \`identity_doc_name\` varchar(450) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`bre_user\` ADD CONSTRAINT \`FK_89d326e530743802db410fa18d6\` FOREIGN KEY (\`user_role_id\`) REFERENCES \`bre_role_master\`(\`role_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
