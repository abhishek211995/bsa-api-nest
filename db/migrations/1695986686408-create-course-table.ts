import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCourseTable1695986686408 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS bre_courses (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(256) NOT NULL DEFAULT '',
            syllabus LONGTEXT,
            fees INT NOT NULL DEFAULT 0,
            start_date DATE,
            end_date DATE,
            is_active BOOLEAN DEFAULT TRUE,
            image VARCHAR(256)
        )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS bre_courses`);
  }
}
