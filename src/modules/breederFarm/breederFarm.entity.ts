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
import { BreAnimalMaster } from "../animalMaster/animalMaster.entity";

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
  animal_type_id: number;

  @ApiProperty()
  @JoinColumn({ name: "animal_type_id" })
  @ManyToOne(() => BreAnimalMaster)
  animal_type: BreAnimalMaster;

  @ApiProperty()
  @Column({ nullable: false, unique: false })
  breeder_id: number;

  @ApiProperty()
  @JoinColumn({ name: "breeder_id" })
  @ManyToOne(() => BreBreeder)
  breeder: BreBreeder;

  @ApiProperty()
  @Column({ default: "" })
  farm_name: string;

  @ApiProperty()
  @Column({ default: "" })
  farm_address: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "", unique: true })
  license_no: string;

  @ApiProperty()
  @Column({ nullable: true, length: 50 })
  license_doc_name: string;

  @ApiProperty()
  @Column({ type: "date", nullable: true })
  license_expiry_date: Date;

  @ApiProperty()
  @Column({ nullable: true })
  logo: string;
}
