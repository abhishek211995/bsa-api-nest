import { ApiProperty } from "@nestjs/swagger";
import {
  BreAnimalBreedMaster,
  BreAnimalMaster,
} from "src/master/master.entity";
import { BreUser } from "src/users/users.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

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
  @Column({ nullable: false, length: 150 })
  animal_color_and_markings: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  animal_gender: string;

  @ApiProperty()
  @Column({ type: "date", nullable: false })
  animal_date_of_birth: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  animal_microchip_id: string;

  @ApiProperty()
  @ManyToOne(() => BreUser)
  @JoinColumn({ name: "animal_owner_id" })
  animal_owner_id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 150 })
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
  @Column({ nullable: true, length: 50 })
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
}
