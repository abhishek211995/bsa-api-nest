import { ApiProperty } from "@nestjs/swagger";
import { BreFarmMaster } from "src/master/master.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BreBreeder } from "../breeder/breeder.entity";

@Entity("bre_breeder_farm")
export class BreBreederFarm {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false, unique: false })
  farm_id: number;

  @ApiProperty()
  @JoinColumn({ name: "farm_id" })
  @ManyToOne(() => BreFarmMaster)
  farm: BreFarmMaster;

  @ApiProperty()
  @Column({ nullable: false, unique: false })
  breeder_id: number;

  @ApiProperty()
  @JoinColumn({ name: "breeder_id" })
  @ManyToOne(() => BreBreeder)
  breeder: BreBreeder;
}
