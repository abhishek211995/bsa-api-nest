import { ApiProperty } from "@nestjs/swagger";
import { BreUser } from "src/modules/users/users.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("bre_breeder")
export class BreBreeder {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  breeder_id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  breeder_license_no: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  breeder_license_doc_name: string;

  @ApiProperty()
  @Column({ type: "date", nullable: false })
  breeder_license_expiry_date: Date;

  @ApiProperty()
  @Column({ nullable: false })
  user_id: number;

  @ApiProperty()
  @JoinColumn({ name: "user_id" })
  @OneToOne(() => BreUser)
  user: BreUser;

  @ApiProperty()
  @CreateDateColumn()
  breeder_created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  breeder_updated_at: Date;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  farm_name: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  farm_address: string;
}
