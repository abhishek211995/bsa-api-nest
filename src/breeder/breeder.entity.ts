import { ApiProperty } from "@nestjs/swagger";
import { BreUser } from "src/users/users.entity";
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
  @Column({ nullable: false })
  farm_id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  breeder_license_no: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  breeder_license_doc_name: string;

  @ApiProperty()
  @Column({type : "date",nullable: false})
  breeder_license_expiry_date: string;

  @OneToOne(() => BreUser)
  @JoinColumn({ name: "user_id" })
  user_id: BreUser;

  @ApiProperty()
  @CreateDateColumn()
  breeder_created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  breeder_updated_at: Date;
}
