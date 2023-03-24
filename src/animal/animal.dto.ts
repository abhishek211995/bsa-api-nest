import { IsDate, IsNumber, IsString } from "class-validator";

export class animalData {
  @IsNumber()
  animal_id: number;

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

  @IsNumber()
  animal_father_id: number;

  @IsNumber()
  animal_mother_id: number;

  @IsString()
  animal_registration_number: string;
}
