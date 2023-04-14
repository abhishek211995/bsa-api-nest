import { ApiProperty } from "@nestjs/swagger";
import { BreFarmMaster } from "src/master/master.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BreBreeder } from "../breeder/breeder.entity";

@Entity("bre_breeder_farm")
export class BreBreederFarm {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  farm_id: number;

  @ApiProperty()
  @JoinColumn({ name: "farm_id" })
  @OneToOne(() => BreFarmMaster)
  farm: BreFarmMaster;

  @ApiProperty()
  @Column({ nullable: false })
  breeder_id: number;

  @ApiProperty()
  @JoinColumn({ name: "breeder_id" })
  @OneToOne(() => BreBreeder)
  breeder: BreBreeder;
}
