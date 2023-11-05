import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsJSON, IsNumber, IsString } from "class-validator";
import { animalRegistrationSource } from "src/constants/animal_registration.constant";

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
  animal_country: string;

  @IsString()
  animal_front_view_image: string;

  @IsString()
  animal_left_view_image: string;

  @IsString()
  animal_right_view_image: string;

  @IsString()
  animal_registration_doc: string;

  @IsString()
  animal_registration_number: string;

  @IsString()
  animal_sire_id: string;

  @IsString()
  animal_dam_id: string;

  @IsString()
  animal_dna_doc: string;

  @IsString()
  animal_hded_doc: string;

  @IsString()
  breeder_name: string;
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
  animalData: string; //AnimalDataDto;
  animalTypeId: number;
  breedId: number;
  generations: string;
  // {
  //   name: string;
  //   id: string;
  //   gender: string;
  //   sireId: string;
  //   damId: string;
  //   pedigree: Record<string, any>;
  // }[];
  userId: number;
  animal_country: string;
  breeder_name: string;
  registration_source: string;
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
    animal_country: string,
    animal_sire_id: string,
    animal_dam_id: string,
    animal_pedigree: Record<string, any>,
    animal_registration_number: string,
    animal_color_and_markings: string,
    animal_date_of_birth: Date,
    animal_microchip_id: string,
    animal_registration_doc: string,
    registration_source: string,
    breeder_name: string,
    is_active: boolean,
  ) {
    this.animal_id = animal_id;
    this.animal_name = animal_name;
    this.animal_type_id = animal_type_id;
    this.animal_breed_id = animal_breed_id;
    this.animal_gender = animal_gender;
    this.animal_owner_id = animal_owner_id;
    this.animal_country = animal_country;
    this.animal_sire_id = animal_sire_id;
    this.animal_dam_id = animal_dam_id;
    this.animal_pedigree = animal_pedigree;
    this.animal_registration_number = animal_registration_number;
    this.animal_color_and_markings = animal_color_and_markings;
    this.animal_date_of_birth = animal_date_of_birth;
    this.animal_microchip_id = animal_microchip_id;
    this.animal_registration_doc = animal_registration_doc;
    this.registration_source = registration_source;
    this.breeder_name = breeder_name;
    this.is_active = is_active;
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
  animal_country: string;

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

  @IsString()
  @ApiProperty()
  registration_source: string;

  @IsString()
  @ApiProperty()
  breeder_name: string;

  @IsBoolean()
  @ApiProperty()
  is_active: boolean;
}

export class ChangeNamePayload {
  @IsString()
  @ApiProperty()
  animal_registration_number: string;

  @IsString()
  @ApiProperty()
  name: string;
}

export class ChangeAnimalStatusPayload {
  @IsString()
  animal_id: string;

  @IsBoolean()
  status: boolean;

  @IsString()
  animal_rejection_reason: string;
}
