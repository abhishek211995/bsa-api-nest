import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { BreUser } from "../users/users.entity";
import { BreCostsMaster } from "src/master/master.entity";

export enum PaymentStatus {
  "Failed" = 0,
  "Success" = 1,
  "Initiated" = 2,
}

@Entity("bre_orders")
export class BreOrders {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  order_id: string;

  @ApiProperty()
  @Column()
  amount: number;

  @ApiProperty()
  @Column({ default: "" })
  receipt: string;

  @ApiProperty()
  @Column()
  user_id: number;

  @ApiProperty()
  @JoinColumn({ name: "user_id" })
  user: BreUser;

  @ApiProperty()
  @Column()
  billing_address: string;

  @ApiProperty()
  @Column({ default: "" })
  description: string;

  @ApiProperty()
  @Column()
  cost_id: string;

  @ApiProperty()
  @JoinColumn({ name: "cost_id" })
  cost: BreCostsMaster;

  @ApiProperty()
  @Column({ default: "" })
  method: string;

  @ApiProperty()
  @Column({ default: "" })
  razorpay_payment_id: string;

  @ApiProperty()
  @Column({ default: "" })
  razorpay_order_id: string;

  @ApiProperty()
  @Column({ default: "" })
  razorpay_signature: string;

  @ApiProperty()
  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.Initiated,
  })
  status: PaymentStatus;

  @ApiProperty()
  @Column({ nullable: true })
  failure_reason: string;

  @ApiProperty()
  @Column({ nullable: true })
  failure_description: string;
}
