import {
  IsEmail,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { BreederDto } from "src/modules/breeder/breeder.dto";

//Login User DTO
export class LoginUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class IndividualUserDto {
  @IsString()
  user_name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  contact_no: string;

  // @IsString()
  identity_doc_name: string;

  @IsString()
  identification_id_no: string;

  @IsString()
  identification_id_name: string;

  @IsString()
  user_country: string;

  @IsString()
  user_address: string;
}

export class ChangeStatusPayload {
  @IsNumber()
  status: number;

  @IsString()
  reason: string;
}
