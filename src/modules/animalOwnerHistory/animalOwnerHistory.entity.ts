import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BreAnimal } from "../animal/animal.entity";
import { BreUser } from "../users/users.entity";

@Entity("bre_animal_owner_history")
export class BreAnimalOwnerHistory {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false, unique: false })
  animal_id: string;

  @ApiProperty()
  @ManyToOne(() => BreAnimal)
  @JoinColumn({ name: "animal_id" })
  animal: BreAnimal;

  @ApiProperty()
  @Column({ nullable: false, unique: false })
  owner_id: number;

  @ApiProperty()
  @ManyToOne(() => BreUser, (breUser) => breUser.id)
  @JoinColumn({ name: "owner_id" })
  owner: BreUser;
}
