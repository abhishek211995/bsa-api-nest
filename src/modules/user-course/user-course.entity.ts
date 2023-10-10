import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BreUser } from "../users/users.entity";
import { BreCourses } from "../courses/courses.entity";
import { PaymentStatus } from "../orders/orders.entity";

@Entity("bre_user_courses")
export class BreUserCourses {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  user_id: number;

  @ApiProperty()
  @ManyToOne(() => BreUser)
  @JoinColumn({ name: "user_id" })
  user: BreUser;

  @ApiProperty()
  @Column()
  course_id: number;

  @ApiProperty()
  @ManyToOne(() => BreCourses)
  @JoinColumn({ name: "course_id" })
  course: BreCourses;

  @ApiProperty()
  @Column({ type: "timestamp" })
  start_date: Date;

  @ApiProperty()
  @Column({ type: "varchar" })
  payment_method: string;

  @ApiProperty()
  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.Initiated,
  })
  payment_status: PaymentStatus;

  @ApiProperty()
  @Column({ type: "varchar" })
  receipt: string;

  @ApiProperty()
  @Column({ type: "varchar" })
  order_id: string;

  @ApiProperty()
  @Column({ type: "varchar" })
  payment_failure_reason: string;

  @ApiProperty()
  @Column({ type: "boolean" })
  completed: boolean;

  @ApiProperty()
  @Column({ type: "timestamp" })
  created_at: Date;

  @ApiProperty()
  @Column({ type: "timestamp" })
  updated_at: Date;
}
