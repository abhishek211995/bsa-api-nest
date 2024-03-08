import { ApiProperty } from "@nestjs/swagger";
import { BreUser } from "src/modules/users/users.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("bre_draft")
export class BreCourses {
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
  @Column({ type: "varchar" })
  draft_type: string;

  @ApiProperty()
  @Column({ type: "json" })
  draft_values: Record<string, any>;

  @ApiProperty()
  @Column({ type: "date" })
  created_at: Date;
}
