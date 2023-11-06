import { MigrationInterface, QueryRunner } from "typeorm";

export class AllTablesCreation1685707122664 implements MigrationInterface {
  name = "AllTablesCreation1685707122664";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`bre_role_master\` (\`role_id\` int NOT NULL AUTO_INCREMENT, \`role_name\` varchar(50) NOT NULL, \`role_description\` varchar(150) NOT NULL, PRIMARY KEY (\`role_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bre_farm_master\` (\`farm_id\` int NOT NULL AUTO_INCREMENT, \`farm_name\` varchar(50) NOT NULL DEFAULT '', \`farm_description\` varchar(150) NOT NULL DEFAULT '', \`is_deleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`farm_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bre_costs_master\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`amount\` int NOT NULL, \`tax\` int NOT NULL, \`delivery_fee\` int NOT NULL, \`description\` varchar(150) NOT NULL, \`is_deleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bre_user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_name\` varchar(100) NOT NULL DEFAULT 1, \`email\` varchar(50) NOT NULL DEFAULT '', \`password\` varchar(150) NOT NULL DEFAULT '', \`contact_no\` varchar(50) NOT NULL DEFAULT '', \`user_country\` varchar(100) NOT NULL DEFAULT '', \`identification_id_no\` varchar(50) NOT NULL DEFAULT '', \`identification_id_name\` varchar(450) NOT NULL DEFAULT '', \`identity_doc_name\` varchar(450) NULL, \`user_address\` varchar(900) NOT NULL DEFAULT '', \`profile_pic\` varchar(450) NULL, \`user_created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_status\` enum ('1', '2', '3') NOT NULL DEFAULT '2', \`reject_reason\` varchar(2000) NOT NULL DEFAULT '', \`user_role_id\` int NULL, UNIQUE INDEX \`IDX_284703935593bc7b708c70ff06\` (\`email\`), UNIQUE INDEX \`IDX_1d51d38c9df5ee6414fcd466a5\` (\`contact_no\`), UNIQUE INDEX \`IDX_d1b47d67e4dcbd8e9dc67b0686\` (\`identification_id_no\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bre_animal_master\` (\`animal_type_id\` int NOT NULL AUTO_INCREMENT, \`animal_type_name\` varchar(50) NOT NULL, \`animal_type_description\` varchar(150) NOT NULL, \`is_deleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`animal_type_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bre_animal_breed_master\` (\`animal_breed_id\` int NOT NULL AUTO_INCREMENT, \`animal_type_id\` int NOT NULL, \`animal_breed_name\` varchar(50) NOT NULL, \`animal_breed_description\` varchar(150) NOT NULL DEFAULT '', \`is_deleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`animal_breed_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bre_animal\` (\`animal_id\` varchar(36) NOT NULL, \`animal_name\` varchar(50) NOT NULL, \`animal_color_and_markings\` varchar(150) NOT NULL DEFAULT '', \`animal_gender\` varchar(50) NOT NULL, \`animal_date_of_birth\` date NULL, \`animal_microchip_id\` varchar(50) NOT NULL DEFAULT '', \`animal_country\` varchar(50) NOT NULL DEFAULT '', \`animal_rejection_reason\` varchar(1000) NULL DEFAULT '', \`animal_front_view_image\` varchar(150) NULL, \`animal_left_view_image\` varchar(150) NULL, \`animal_right_view_image\` varchar(150) NULL, \`animal_registration_doc\` varchar(150) NULL, \`animal_registration_number\` varchar(50) NOT NULL, \`animal_dna_doc\` varchar(50) NULL, \`animal_hded_doc\` varchar(50) NULL, \`animal_sire_id\` varchar(255) NULL, \`animal_dam_id\` varchar(255) NULL, \`animal_pedigree\` json NULL, \`is_active\` tinyint NOT NULL DEFAULT 0, \`registration_source\` varchar(255) NULL, \`animal_type_id\` int NULL, \`animal_breed_id\` int NULL, \`animal_owner_id\` int NULL, PRIMARY KEY (\`animal_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bre_breeder\` (\`breeder_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`breeder_created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`breeder_updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_360c1615118a61c301a7004d71\` (\`user_id\`), PRIMARY KEY (\`breeder_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bre_breeder_farm\` (\`id\` int NOT NULL AUTO_INCREMENT, \`farm_id\` int NOT NULL, \`animal_type_id\` int NOT NULL, \`breeder_id\` int NOT NULL, \`farm_name\` varchar(255) NOT NULL DEFAULT '', \`farm_address\` varchar(255) NOT NULL DEFAULT '', \`license_no\` varchar(50) NOT NULL DEFAULT '', \`license_doc_name\` varchar(50) NULL, \`license_expiry_date\` date NULL, \`logo\` varchar(255) NULL, UNIQUE INDEX \`IDX_3a856e8fc998a2deb56549727f\` (\`license_no\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bre_litter_registration\` (\`id\` int NOT NULL AUTO_INCREMENT, \`litters\` json NOT NULL, \`dob\` date NOT NULL, \`meeting_date\` date NOT NULL, \`meeting_time\` varchar(255) NOT NULL, \`sire_id\` varchar(255) NULL, \`dam_id\` varchar(255) NOT NULL, \`mating_date\` date NOT NULL, \`owner_id\` int NOT NULL, \`sire_owner_id\` int NULL, \`remarks\` json NULL, \`sire_approval\` tinyint NOT NULL DEFAULT 0, \`sire_rejection_reason\` varchar(255) NULL, \`sire_action_taken\` tinyint NULL, \`sire_action_time\` datetime NULL, \`completed\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bre_orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`order_id\` varchar(255) NOT NULL, \`amount\` int NOT NULL, \`receipt\` varchar(255) NOT NULL DEFAULT '', \`user_id\` int NOT NULL, \`billing_address\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL DEFAULT '', \`cost_id\` varchar(255) NOT NULL, \`method\` varchar(255) NOT NULL DEFAULT '', \`razorpay_payment_id\` varchar(255) NOT NULL DEFAULT '', \`razorpay_order_id\` varchar(255) NOT NULL DEFAULT '', \`razorpay_signature\` varchar(255) NOT NULL DEFAULT '', \`status\` enum ('0', '1', '2') NOT NULL DEFAULT '2', \`failure_reason\` varchar(255) NULL, \`failure_description\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bre_transfer_owner_request\` (\`transfer_id\` int NOT NULL AUTO_INCREMENT, \`request_created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`request_Completed_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`request_status\` varchar(255) NOT NULL DEFAULT 'In progress', \`request_rejection_reason\` varchar(500) NULL, \`old_owner_id\` int NULL, \`new_owner_id\` int NULL, \`animal_id\` varchar(36) NULL, PRIMARY KEY (\`transfer_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bre_user_subscription\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`subscription_start_date\` datetime NOT NULL, \`subscription_end_date\` datetime NOT NULL, \`subscription_created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`subscription_updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`amount_paid\` int NOT NULL DEFAULT '0', \`subscription_active\` tinyint NOT NULL DEFAULT 1, \`order_id\` int NOT NULL, UNIQUE INDEX \`REL_39a34497da9b8cf2c6822c56ac\` (\`order_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_user\` ADD CONSTRAINT \`FK_89d326e530743802db410fa18d6\` FOREIGN KEY (\`user_role_id\`) REFERENCES \`bre_role_master\`(\`role_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_animal_breed_master\` ADD CONSTRAINT \`FK_80c58e37f491c33fe704a30c810\` FOREIGN KEY (\`animal_type_id\`) REFERENCES \`bre_animal_master\`(\`animal_type_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_animal\` ADD CONSTRAINT \`FK_5cd1c566d6b601ae21cccb88ba3\` FOREIGN KEY (\`animal_type_id\`) REFERENCES \`bre_animal_master\`(\`animal_type_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_animal\` ADD CONSTRAINT \`FK_9e02f2b74cb340cee4258cd8a81\` FOREIGN KEY (\`animal_breed_id\`) REFERENCES \`bre_animal_breed_master\`(\`animal_breed_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_animal\` ADD CONSTRAINT \`FK_6f6932fe705fa966206ace4127a\` FOREIGN KEY (\`animal_owner_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_breeder\` ADD CONSTRAINT \`FK_360c1615118a61c301a7004d71c\` FOREIGN KEY (\`user_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_breeder_farm\` ADD CONSTRAINT \`FK_cad822eaa4708944a5d9502f6d8\` FOREIGN KEY (\`farm_id\`) REFERENCES \`bre_farm_master\`(\`farm_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_breeder_farm\` ADD CONSTRAINT \`FK_c93e4df52145641f5c3adc39830\` FOREIGN KEY (\`animal_type_id\`) REFERENCES \`bre_animal_master\`(\`animal_type_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_breeder_farm\` ADD CONSTRAINT \`FK_aa58f8120007824c6c9873f1f71\` FOREIGN KEY (\`breeder_id\`) REFERENCES \`bre_breeder\`(\`breeder_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_litter_registration\` ADD CONSTRAINT \`FK_85e906894fb774e202c4b806aaf\` FOREIGN KEY (\`sire_id\`) REFERENCES \`bre_animal\`(\`animal_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_litter_registration\` ADD CONSTRAINT \`FK_49ad6c0c44354a9b43cbeabd991\` FOREIGN KEY (\`dam_id\`) REFERENCES \`bre_animal\`(\`animal_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_litter_registration\` ADD CONSTRAINT \`FK_36b1bb427489f89e0b5b59510ab\` FOREIGN KEY (\`owner_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_litter_registration\` ADD CONSTRAINT \`FK_3a4443a160c780e65ae83cf0c2e\` FOREIGN KEY (\`sire_owner_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_transfer_owner_request\` ADD CONSTRAINT \`FK_4745720d08c39d04ca28bcac143\` FOREIGN KEY (\`old_owner_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_transfer_owner_request\` ADD CONSTRAINT \`FK_a1cf1dce27afc19057b5b7263a5\` FOREIGN KEY (\`new_owner_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_transfer_owner_request\` ADD CONSTRAINT \`FK_06888907f918c48d9345dd07ef4\` FOREIGN KEY (\`animal_id\`) REFERENCES \`bre_animal\`(\`animal_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_user_subscription\` ADD CONSTRAINT \`FK_4c668ed44f4efc21342038ebc05\` FOREIGN KEY (\`user_id\`) REFERENCES \`bre_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_user_subscription\` ADD CONSTRAINT \`FK_39a34497da9b8cf2c6822c56acd\` FOREIGN KEY (\`order_id\`) REFERENCES \`bre_orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bre_user_subscription\` DROP FOREIGN KEY \`FK_39a34497da9b8cf2c6822c56acd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_user_subscription\` DROP FOREIGN KEY \`FK_4c668ed44f4efc21342038ebc05\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_transfer_owner_request\` DROP FOREIGN KEY \`FK_06888907f918c48d9345dd07ef4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_transfer_owner_request\` DROP FOREIGN KEY \`FK_a1cf1dce27afc19057b5b7263a5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_transfer_owner_request\` DROP FOREIGN KEY \`FK_4745720d08c39d04ca28bcac143\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_litter_registration\` DROP FOREIGN KEY \`FK_3a4443a160c780e65ae83cf0c2e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_litter_registration\` DROP FOREIGN KEY \`FK_36b1bb427489f89e0b5b59510ab\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_litter_registration\` DROP FOREIGN KEY \`FK_49ad6c0c44354a9b43cbeabd991\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_litter_registration\` DROP FOREIGN KEY \`FK_85e906894fb774e202c4b806aaf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_breeder_farm\` DROP FOREIGN KEY \`FK_aa58f8120007824c6c9873f1f71\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_breeder_farm\` DROP FOREIGN KEY \`FK_c93e4df52145641f5c3adc39830\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_breeder_farm\` DROP FOREIGN KEY \`FK_cad822eaa4708944a5d9502f6d8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_breeder\` DROP FOREIGN KEY \`FK_360c1615118a61c301a7004d71c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_animal\` DROP FOREIGN KEY \`FK_6f6932fe705fa966206ace4127a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_animal\` DROP FOREIGN KEY \`FK_9e02f2b74cb340cee4258cd8a81\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_animal\` DROP FOREIGN KEY \`FK_5cd1c566d6b601ae21cccb88ba3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_animal_breed_master\` DROP FOREIGN KEY \`FK_80c58e37f491c33fe704a30c810\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bre_user\` DROP FOREIGN KEY \`FK_89d326e530743802db410fa18d6\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_39a34497da9b8cf2c6822c56ac\` ON \`bre_user_subscription\``,
    );
    await queryRunner.query(`DROP TABLE \`bre_user_subscription\``);
    await queryRunner.query(`DROP TABLE \`bre_transfer_owner_request\``);
    await queryRunner.query(`DROP TABLE \`bre_orders\``);
    await queryRunner.query(`DROP TABLE \`bre_litter_registration\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_3a856e8fc998a2deb56549727f\` ON \`bre_breeder_farm\``,
    );
    await queryRunner.query(`DROP TABLE \`bre_breeder_farm\``);
    await queryRunner.query(
      `DROP INDEX \`REL_360c1615118a61c301a7004d71\` ON \`bre_breeder\``,
    );
    await queryRunner.query(`DROP TABLE \`bre_breeder\``);
    await queryRunner.query(`DROP TABLE \`bre_animal\``);
    await queryRunner.query(`DROP TABLE \`bre_animal_breed_master\``);
    await queryRunner.query(`DROP TABLE \`bre_animal_master\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d1b47d67e4dcbd8e9dc67b0686\` ON \`bre_user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_1d51d38c9df5ee6414fcd466a5\` ON \`bre_user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_284703935593bc7b708c70ff06\` ON \`bre_user\``,
    );
    await queryRunner.query(`DROP TABLE \`bre_user\``);
    await queryRunner.query(`DROP TABLE \`bre_costs_master\``);
    await queryRunner.query(`DROP TABLE \`bre_farm_master\``);
    await queryRunner.query(`DROP TABLE \`bre_role_master\``);
  }
}
