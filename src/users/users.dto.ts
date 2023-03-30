import {
  IsEmail,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { BreederDto } from "src/breeder/breeder.dto";

//Login User DTO
export class LoginUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class CreateUserDto extends BreederDto {
  @IsString()
  user_name: string;

  @IsNumber()
  user_role_id: number;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(10)
  @MaxLength(10)
  contact_no: string;

  @IsString()
  user_country: string;

  @IsString()
  identification_id_no: string;

  @IsString()
  identification_id_name: string;

  @IsString()
  identity_doc_name: string;
}

export class SubscriptionDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  subscription_id: number;

  @IsString()
  subscription_start_date: string;

  @IsString()
  subscription_end_date: string;

  @IsNumber()
  Amount_paid: number;

  @IsString()
  subscription_status: string;
}
