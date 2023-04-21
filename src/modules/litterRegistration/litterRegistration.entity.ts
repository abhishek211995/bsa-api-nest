import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BreUser } from "../users/users.entity";
import { BreAnimal } from "../animal/animal.entity";
import { IsString } from "class-validator";

@Entity("bre_litter_registration")
export class BreLitterRegistration {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: "json" })
  litters: { name: string; color_mark: string; gender: string }[];

  @ApiProperty()
  @Column({ type: "date" })
  dob: Date;

  @ApiProperty()
  @Column({ type: "date" })
  meeting_date: string;

  @ApiProperty()
  @Column()
  meeting_time: string;

  @ApiProperty()
  @Column()
  sire_id: string;

  @ApiProperty()
  @JoinColumn({ name: "sire_id" })
  @ManyToOne(() => BreAnimal)
  sire: BreAnimal;

  @ApiProperty()
  @Column()
  dam_id: string;

  @ApiProperty()
  @JoinColumn({ name: "dam_id" })
  @ManyToOne(() => BreAnimal)
  dam: BreAnimal;

  @ApiProperty()
  @Column()
  owner_id: string;

  @ApiProperty()
  @JoinColumn({ name: "owner_id" })
  @ManyToOne(() => BreUser)
  owner: BreUser;

  @ApiProperty()
  @Column({ default: false })
  completed: boolean;

  @ApiProperty()
  @Column({ type: "json" })
  remarks: { message: string; user_name: string }[];

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty()
  @IsString()
  otp: string;
}
