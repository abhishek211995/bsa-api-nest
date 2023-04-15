import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("bre_animal_master")
export class BreAnimalMaster {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  animal_type_id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  animal_type_name: string;

  @ApiProperty()
  @Column({ nullable: false, length: 150 })
  animal_type_description: string;
}
