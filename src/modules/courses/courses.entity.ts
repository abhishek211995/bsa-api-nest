import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("bre_courses")
export class BreCourses {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: "varchar" })
  name: string;

  @ApiProperty()
  @Column({ type: "longtext" })
  syllabus: string;

  @ApiProperty()
  @Column({ type: "int" })
  fees: number;

  @ApiProperty()
  @Column({ type: "date" })
  start_date: Date;

  @ApiProperty()
  @Column({ type: "date" })
  end_date: Date;

  @ApiProperty()
  @Column()
  image: string;
}
