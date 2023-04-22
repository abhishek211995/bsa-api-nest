import { ApiProperty } from "@nestjs/swagger";
import { BreAnimal } from "src/modules/animal/animal.entity";
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

@Entity("bre_transfer_owner_request")
export class BreTransferOwnerRequest {
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
  @ManyToOne(() => BreAnimal)
  @JoinColumn({ name: "animal_id" })
  animal_id: string;

  @ApiProperty()
  @CreateDateColumn()
  request_created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  request_Completed_at: Date;

  @ApiProperty()
  @Column({ nullable: false, default: "In progress" })
  request_status: string;

  @ApiProperty()
  @Column({ nullable: true, length: 500 })
  request_rejection_reason: string;
}
