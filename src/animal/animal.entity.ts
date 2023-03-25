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
  @PrimaryGeneratedColumn()
  animal_id: number;

  // @ApiProperty()
  // @Column({ nullable: false, length: 50, default: true })
  // animal_name: string;

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
  @Column({ nullable: false, length: 50, default: "" })
  animal_gender: string;

  @ApiProperty()
  @Column({ type: "date", nullable: false })
  animal_date_of_birth: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  animal_microchip_id: string;

  @ApiProperty()
  @ManyToOne(() => BreUser)
  @JoinColumn({ name: "animal_owner_id" })
  animal_owner_id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 150, default: "" })
  animal_front_view_image: string;

  @ApiProperty()
  @Column({ nullable: false, length: 150, default: "" })
  animal_left_view_image: string;

  @ApiProperty()
  @Column({ nullable: false, length: 150, default: "" })
  animal_right_view_image: string;

  // @ApiProperty()
  // @Column({ nullable: false, length: 50, default: "" })
  // animal_registration_number: string;
}
