import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BreUser } from "../users/users.entity";

@Entity("bre_company")
export class BreCompany {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  company_id: number;

  @ApiProperty()
  @Column()
  user_id: number;

  @ApiProperty()
  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => BreUser)
  user: BreUser;
}
