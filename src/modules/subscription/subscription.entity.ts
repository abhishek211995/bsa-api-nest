import { ApiProperty } from "@nestjs/swagger";
import { BreUser } from "src/modules/users/users.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BreOrders } from "../orders/orders.entity";

@Entity("bre_user_subscription")
export class BreUserSubscription {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  user_id: number;

  @ApiProperty()
  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => BreUser)
  user: BreUser;

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
  @Column({ nullable: false, length: 50, default: 0 })
  amount_paid: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: true })
  subscription_active: boolean;

  @ApiProperty()
  @Column()
  order_id: number;

  @ApiProperty()
  @JoinColumn({ name: "order_id" })
  @OneToOne(() => BreOrders)
  order: BreOrders;
}
