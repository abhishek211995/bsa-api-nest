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

export class CreateUserDto extends BreederDto {
  @IsString()
  user_name: string;

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
