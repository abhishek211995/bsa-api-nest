import { ApiProperty } from "@nestjs/swagger";
import { BreBreederFarm } from "src/modules/breederFarm/breederFarm.entity";
import { BreUser } from "src/modules/users/users.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("bre_transfer_farm_request")
export class BreTransferFarmRequest {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  transfer_id: number;

  @ApiProperty()
  @ManyToOne(() => BreUser, (breUser) => breUser.id)
  @JoinColumn({ name: "old_owner_id" })
  old_owner_id: number;

  @ApiProperty()
  @ManyToOne(() => BreUser, (breUser) => breUser.id)
  @JoinColumn({ name: "new_owner_id" })
  new_owner_id: number;

  @ApiProperty()
  @Column()
  farm_id: number;

  @ApiProperty()
  @ManyToOne(() => BreBreederFarm)
  @JoinColumn({ name: "farm_id" })
  farm: BreBreederFarm;

  @ApiProperty()
  @CreateDateColumn()
  request_created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  request_completed_at: Date;

  @ApiProperty()
  @Column({ nullable: false, default: "In progress" })
  request_status: string;

  @ApiProperty()
  @Column({ nullable: true, length: 500 })
  request_rejection_reason: string;
}
