import { IsBoolean, IsNumber, IsString } from "class-validator";

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

export class CostsDto {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsNumber()
  tax: number;

  @IsNumber()
  delivery_fee: number;
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
