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
import { BreAnimal } from "../animal/animal.entity";
import { BreUser } from "../users/users.entity";

@Entity("bre_litter_registration")
export class BreLitterRegistration {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: "json" })
  litters: { litterName: string; colorMark: string; litterGender: string }[];

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
  @Column({ type: "date" })
  mating_date: string;

  @ApiProperty()
  @Column()
  owner_id: string;

  @ApiProperty()
  @JoinColumn({ name: "owner_id" })
  @ManyToOne(() => BreUser)
  owner: BreUser;

  @ApiProperty()
  @Column()
  sire_owner_id: string;

  @ApiProperty()
  @JoinColumn({ name: "sire_owner_id" })
  @ManyToOne(() => BreUser)
  sire_owner: BreUser;

  @ApiProperty()
  @Column({ type: "json" })
  remarks: { message: string; user_name: string }[];

  @ApiProperty()
  @Column({ default: false })
  sire_approval: boolean; // 1 for approved, 0 for pending/declined depending on sire_rejection_reason

  @ApiProperty()
  @Column({ nullable: true })
  sire_rejection_reason: string; // if string then sire rejected a litter

  @ApiProperty()
  @Column({ nullable: true })
  sire_action_taken: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  sire_action_time: Date;

  @ApiProperty()
  @Column({ default: false })
  completed: boolean;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}

// @Entity("bre_otp_mapping")
// export class BreOtpMapping {
//   @ApiProperty()
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ApiProperty()
//   @Column({ nullable: false })
//   otp: number;

//   @ApiProperty()
//   @CreateDateColumn()
//   created_at: Date;

//   @ApiProperty()
//   @Column()
//   validity: Date;

//   @ApiProperty()
//   @Column({ nullable: false })
//   reason: string;

//   @ApiProperty()
//   @Column({ nullable: false })
//   user_id: number;

//   @ApiProperty()
//   @JoinColumn({ name: "user_id" })
//   @ManyToOne(() => BreUser)
//   user: BreUser;

//   @ApiProperty()
//   @Column({ default: false })
//   verified: boolean;
// }
