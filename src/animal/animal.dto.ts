import { IsDate, IsNumber, IsString } from "class-validator";

export class AnimalDto {
  // @IsString()
  // animal_name: string;

  @IsNumber()
  animal_type_id: number;

  @IsNumber()
  animal_breed_id: number;

  @IsString()
  animal_color_and_markings: string;

  @IsString()
  animal_gender: string;

  @IsString()
  animal_date_of_birth: string;

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

  // @IsString()
  // animal_registration_number: string;
}
