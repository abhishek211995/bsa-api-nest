import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BreAnimalMaster } from "../animalMaster/animalMaster.entity";

@Entity("bre_animal_breed_master")
export class BreAnimalBreedMaster {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  animal_breed_id: number;

  @ApiProperty()
  @Column({ name: "animal_type_id" })
  animal_type_id: number;

  @ApiProperty()
  @JoinColumn({ name: "animal_type_id" })
  @ManyToOne(() => BreAnimalMaster)
  animal_type: BreAnimalMaster;

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  animal_breed_name: string;

  @ApiProperty()
  @Column({ nullable: false, length: 150, default: "" })
  animal_breed_description: string;

  @ApiProperty()
  @Column({ default: false })
  is_deleted: boolean;
}
