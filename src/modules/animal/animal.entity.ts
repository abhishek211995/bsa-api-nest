import { ApiProperty } from "@nestjs/swagger";
import { BreUser } from "src/modules/users/users.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BreAnimalMaster } from "../animalMaster/animalMaster.entity";
import { BreAnimalBreedMaster } from "../breedMaster/breedMaster.entity";

@Entity("bre_animal")
export class BreAnimal {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  animal_id: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  animal_name: string;

  @ApiProperty()
  @ManyToOne(() => BreAnimalMaster)
  @JoinColumn({ name: "animal_type_id" })
  animal_type_id: number;

  @ApiProperty()
  @ManyToOne(() => BreAnimalBreedMaster)
  @JoinColumn({ name: "animal_breed_id" })
  animal_breed_id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 150, default: "" })
  animal_color_and_markings: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  animal_gender: string;

  @ApiProperty()
  @Column({ type: "date", nullable: true })
  animal_date_of_birth: Date;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  animal_microchip_id: string;

  @ApiProperty()
  @ManyToOne(() => BreUser)
  @JoinColumn({ name: "animal_owner_id" })
  animal_owner_id: number;

  @ApiProperty()
  @Column({ nullable: true, length: 150 })
  animal_front_view_image: string;

  @ApiProperty()
  @Column({ nullable: true, length: 150 })
  animal_left_view_image: string;

  @ApiProperty()
  @Column({ nullable: true, length: 150 })
  animal_right_view_image: string;

  @ApiProperty()
  @Column({ nullable: true, length: 150 })
  animal_registration_doc: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  animal_registration_number: string;

  @ApiProperty()
  @Column({ nullable: true })
  animal_sire_id: string;

  @ApiProperty()
  @Column({ nullable: true })
  animal_dam_id: string;

  @ApiProperty()
  @Column({ nullable: true, type: "json" })
  animal_pedigree: Record<string, any>;

  @ApiProperty()
  @Column({ default: false })
  is_active: boolean;
}
