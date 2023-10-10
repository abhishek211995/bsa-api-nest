import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserCourseTable1696218393831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS bre_user_courses (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            course_id INT NOT NULL,
            start_date TIMESTAMP DEFAULT NOW(),
            payment_method VARCHAR(256),
            payment_status ENUM('0', '1', '2') DEFAULT 2,
            receipt VARCHAR(256),
            order_id VARCHAR(256),
            payment_failure_reason VARCHAR(256),
            completed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            CONSTRAINT FK_user_course FOREIGN KEY (user_id)
                REFERENCES bre_user (id)
                ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT FK_course_user FOREIGN KEY (course_id)
                REFERENCES bre_courses (id)
                ON DELETE CASCADE ON UPDATE CASCADE
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF NOT EXISTS bre_user_courses`);
  }
}
