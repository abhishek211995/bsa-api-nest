import { ApiProperty } from "@nestjs/swagger";
import {
  BreAnimalBreedMaster,
  BreAnimalMaster,
} from "src/master/master.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity("bre_animal")
export class BreAnimal {
  @ApiProperty()
  @Column({ nullable: false, length: 50, default: true })
  animal_id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: true })
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
  @Column({ nullable: false, length: 50, default: "" })
  animal_gender: string;

  @ApiProperty()
  @Column({ type: "date", nullable: false })
  animal_date_of_birth: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  animal_microchip_id: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  animal_owner_id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  animal_front_view_image: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  animal_side_view_image: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  animal_back_view_image: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  animal_registration_number: string;
}
