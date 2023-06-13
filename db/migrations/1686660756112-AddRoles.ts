import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoles1686660756112 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add roles in BreRoleMaster
    await queryRunner.query(
      `INSERT INTO bre_role_master (role_name,role_description) VALUES ('breeder','breeder')`,
    );
    await queryRunner.query(
      `INSERT INTO bre_role_master (role_name,role_description) VALUES ('user','user')`,
    );
    await queryRunner.query(
      `INSERT INTO bre_role_master (role_name,role_description) VALUES ('admin','admin')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete roles from BreRoleMaster
    await queryRunner.query(
      `DELETE FROM bre_role_master WHERE role_name = 'breeder'`,
    );
    await queryRunner.query(
      `DELETE FROM bre_role_master WHERE role_name = 'user'`,
    );
    await queryRunner.query(
      `DELETE FROM bre_role_master WHERE role_name = 'admin'`,
    );
  }
}
