import { IsNumber, IsString } from "class-validator";

export class RoleDto {
  @IsString()
  role_name: string;

  @IsString()
  role_description: string;
}

export class FarmTypeDto {
  @IsString()
  farm_name: string;

  @IsString()
  farm_description: string;
}

export class AnimalBreedDto {
  @IsNumber()
  animal_type_id: number;

  @IsString()
  animal_breed_name: string;

  @IsString()
  animal_breed_description: string;
}

export class CostsDto {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;
}

export class SubscriptionDto {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsString()
  status: string;
}
