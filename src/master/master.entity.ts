import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("bre_role_master")
export class BreRoleMaster {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  role_id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  role_name: string;

  @ApiProperty()
  @Column({ nullable: false, length: 150 })
  role_description: string;
}

@Entity("bre_farm_master")
export class BreFarmMaster {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  farm_id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  farm_name: string;

  @ApiProperty()
  @Column({ nullable: false, length: 150 })
  farm_description: string;
}

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

@Entity("bre_animal_breed_master")
export class BreAnimalBreedMaster {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  animal_breed_id: number;

  @ApiProperty()
  @ManyToOne(() => BreAnimalMaster, (animal) => animal.animal_type_id)
  @JoinColumn({ name: "animal_type_id" })
  animal_type_id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  animal_breed_name: string;

  @ApiProperty()
  @Column({ nullable: false, length: 150 })
  animal_breed_description: string;
}

@Entity("bre_costs_master")
export class BreCostsMaster {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  name: string;

  @ApiProperty()
  @Column({ nullable: false })
  amount: number;

  @ApiProperty()
  @Column({ nullable: false, length: 150 })
  description: string;
}

@Entity("bre_subscriptions_master")
export class BreSubscriptionsMaster {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  name: string;

  @ApiProperty()
  @Column({ nullable: false })
  amount: number;

  @ApiProperty()
  @Column({ nullable: false, length: 150 })
  description: string;

  @ApiProperty()
  @Column({ nullable: false, length: 150 })
  status: string;
}
