import { ApiProperty } from "@nestjs/swagger";
import { BreSubscriptionsMaster } from "src/master/master.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

enum UserType {
  "admin",
  "breeder",
  "individual",
}

enum UserStatus {
  "Verified" = 1,
  "Verification Pending" = 2,
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
  @Column({ type: "enum", enum: UserType })
  user_role_id: UserType;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "", unique: true })
  email: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
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
  @Column({ nullable: false, length: 50, default: "" })
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

@Entity()
export class loginUserDto {
  @ApiProperty()
  @Column({ nullable: false, length: 50, default: true })
  email: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  password: string;
}

@Entity("bre_user_subscription")
export class BreUserSubscription {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @ManyToOne(() => BreUser, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user_id: number;

  @ApiProperty()
  @ManyToOne(() => BreSubscriptionsMaster, (subscription) => subscription.id)
  @JoinColumn({ name: "subscription_id" })
  subscription_id: number;

  @ApiProperty()
  @Column({ nullable: false })
  subscription_start_date: Date;

  @ApiProperty()
  @Column({ nullable: false })
  subscription_end_date: Date;

  @ApiProperty()
  @CreateDateColumn()
  subscription_created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  subscription_updated_at: Date;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: true })
  Amount_paid: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: true })
  subscription_status: string;
}
