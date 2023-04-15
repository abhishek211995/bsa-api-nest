import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("bre_role_master")
export class BreRoleMaster {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  role_id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  role_name: string;

  @ApiProperty()
  @Column({ nullable: false, length: 150 })
  role_description: string;
}

@Entity("bre_farm_master")
export class BreFarmMaster {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  farm_id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  farm_name: string;

  @ApiProperty()
  @Column({ nullable: false, length: 150, default: "" })
  farm_description: string;
}

@Entity("bre_costs_master")
export class BreCostsMaster {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  name: string;

  @ApiProperty()
  @Column({ nullable: false })
  amount: number;

  @ApiProperty()
  @Column({ nullable: false, length: 150 })
  description: string;
}

@Entity("bre_subscriptions_master")
export class BreSubscriptionsMaster {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  name: string;

  @ApiProperty()
  @Column({ nullable: false })
  amount: number;

  @ApiProperty()
  @Column({ nullable: false, length: 150 })
  description: string;

  @ApiProperty()
  @Column({ nullable: false, length: 150 })
  status: string;
}
