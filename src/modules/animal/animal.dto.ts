import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsJSON, IsNumber, IsString } from "class-validator";

export class AnimalDto {
  @IsString()
  animal_name: string;

  @IsNumber()
  animal_type_id: number;

  @IsNumber()
  animal_breed_id: number;

  @IsString()
  animal_color_and_markings: string;

  @IsString()
  animal_gender: string;

  @IsDate()
  animal_date_of_birth: Date;

  @IsString()
  animal_microchip_id: string;

  @IsNumber()
  animal_owner_id: number;

  @IsString()
  animal_front_view_image: string;

  @IsString()
  animal_left_view_image: string;

  @IsString()
  animal_right_view_image: string;

  @IsString()
  animal_registration_number: string;

  @IsString()
  animal_sire_id: string;

  @IsString()
  animal_dam_id: string;
}

export class AnimalDataDto {
  @IsString()
  name: string;

  @IsString()
  id: string;

  @IsString()
  gender: string;

  @IsString()
  sireId: string;

  @IsString()
  damId: string;

  @IsString()
  dob: string;

  @IsString()
  microchip: string;

  @IsString()
  colorMarking: string;

  @IsJSON()
  pedigree: Record<string, any>;
}
export class AnimalWithPedigreePayload {
  animalData: AnimalDataDto;
  animalTypeId: number;
  breedId: number;
  generations: {
    name: string;
    id: string;
    gender: string;
    sireId: string;
    damId: string;
    pedigree: Record<string, any>;
  }[];
}

export class CreateGenerationsDto {
  constructor(
    animal_id: string,
    animal_name: string,
    animal_type_id: number,
    animal_breed_id: number,
    animal_gender: string,
    animal_owner_id: number,
    animal_sire_id: string,
    animal_dam_id: string,
    animal_pedigree: Record<string, any>,
    animal_registration_number: string,
  ) {
    this.animal_id = animal_id;
    this.animal_name = animal_name;
    this.animal_type_id = animal_type_id;
    this.animal_breed_id = animal_breed_id;
    this.animal_gender = animal_gender;
    this.animal_owner_id = animal_owner_id;
    this.animal_sire_id = animal_sire_id;
    this.animal_dam_id = animal_dam_id;
    this.animal_pedigree = animal_pedigree;
    this.animal_registration_number = animal_registration_number;
  }

  @IsString()
  @ApiProperty()
  animal_id: string;

  @IsString()
  @ApiProperty()
  animal_name: string;

  @IsNumber()
  @ApiProperty()
  animal_type_id: number;

  @IsNumber()
  @ApiProperty()
  animal_breed_id: number;

  @IsString()
  @ApiProperty()
  animal_gender: string;

  @IsNumber()
  @ApiProperty()
  animal_owner_id: number;

  @IsString()
  @ApiProperty()
  animal_sire_id: string;

  @IsString()
  @ApiProperty()
  animal_dam_id: string;

  @IsJSON()
  @ApiProperty()
  animal_pedigree: Record<string, any>;

  @IsString()
  @ApiProperty()
  animal_registration_number: string;
}

export class CreateAnimalDto {
  constructor(
    animal_id: string,
    animal_name: string,
    animal_type_id: number,
    animal_breed_id: number,
    animal_gender: string,
    animal_owner_id: number,
    animal_sire_id: string,
    animal_dam_id: string,
    animal_pedigree: Record<string, any>,
    animal_registration_number: string,
    animal_color_and_markings: string,
    animal_date_of_birth: Date,
    animal_microchip_id: string,
    animal_registration_doc: string,
  ) {
    this.animal_id = animal_id;
    this.animal_name = animal_name;
    this.animal_type_id = animal_type_id;
    this.animal_breed_id = animal_breed_id;
    this.animal_gender = animal_gender;
    this.animal_owner_id = animal_owner_id;
    this.animal_sire_id = animal_sire_id;
    this.animal_dam_id = animal_dam_id;
    this.animal_pedigree = animal_pedigree;
    this.animal_registration_number = animal_registration_number;
    this.animal_color_and_markings = animal_color_and_markings;
    this.animal_date_of_birth = animal_date_of_birth;
    this.animal_microchip_id = animal_microchip_id;
    this.animal_registration_doc = animal_registration_doc;
  }

  @IsString()
  @ApiProperty()
  animal_id: string;

  @IsString()
  @ApiProperty()
  animal_name: string;

  @IsNumber()
  @ApiProperty()
  animal_type_id: number;

  @IsNumber()
  @ApiProperty()
  animal_breed_id: number;

  @IsString()
  @ApiProperty()
  animal_color_and_markings: string;

  @IsString()
  @ApiProperty()
  animal_gender: string;

  @IsDate()
  @ApiProperty()
  animal_date_of_birth: Date;

  @IsString()
  @ApiProperty()
  animal_microchip_id: string;

  @IsNumber()
  @ApiProperty()
  animal_owner_id: number;

  @IsString()
  @ApiProperty()
  animal_registration_doc: string;

  @IsString()
  @ApiProperty()
  animal_registration_number: string;

  @IsString()
  @ApiProperty()
  animal_sire_id: string;

  @IsString()
  @ApiProperty()
  animal_dam_id: string;

  @IsJSON()
  @ApiProperty()
  animal_pedigree: Record<string, any>;
}