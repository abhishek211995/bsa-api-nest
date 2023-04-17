import { ApiProperty } from "@nestjs/swagger";
import { BreRoleMaster } from "src/master/master.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum UserStatus {
  "Verified" = 1,
  "Verification Pending" = 2,
  "Rejected" = 3,
}

@Entity("bre_user")
export class BreUser {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: true })
  user_name: string;

  @ApiProperty()
  @ManyToOne(() => BreRoleMaster, (breRoleMaster) => breRoleMaster.role_id)
  @JoinColumn({ name: "user_role_id" })
  user_role_id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "", unique: true })
  email: string;

  @ApiProperty()
  @Column({ nullable: false, length: 150, default: "" })
  password: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "", unique: true })
  contact_no: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  user_country: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "", unique: true })
  identification_id_no: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  identification_id_name: string;

  @ApiProperty()
  @Column({ nullable: true, length: 250 })
  identity_doc_name: string;

  @ApiProperty()
  @CreateDateColumn()
  user_created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  user_updated_at: Date;

  @ApiProperty()
  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus["Verification Pending"],
  })
  user_status: UserStatus;
}
