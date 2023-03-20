import { IsString } from "class-validator";

export class FarmTypeDto {
  @IsString()
  farm_name: string;

  @IsString()
  farm_description: string;
}

export class AnimalTypeDto {
  @IsString()
  animal_type_name: string;

  @IsString()
  animal_type_description: string;
}