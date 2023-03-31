import { ApiProperty } from "@nestjs/swagger";
import { BreSubscriptionsMaster } from "src/master/master.entity";
import { BreUser } from "src/users/users.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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
