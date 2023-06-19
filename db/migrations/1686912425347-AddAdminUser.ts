import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminUser1686912425347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO bre_user (user_name,email, password,contact_no,user_country,user_created_at,user_updated_at,user_status,user_role_id) VALUES ('Breeder Admin','admin@genuinebreeder.com','$2b$10$eqeALDxxKmtLeoVV./GFleMwcROJ0pHp7VVckJQ0BzXEpGz.CQsYW','','',now(),now(),1,3)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM bre_user WHERE email = 'admin@genuinebreeder.com'`,
    );
  }
}
