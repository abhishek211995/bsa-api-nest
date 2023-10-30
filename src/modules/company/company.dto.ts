import { IsEmail, IsString } from "class-validator";

export class CreateCompanyDto {
  @IsString()
  companyName: string;

  @IsEmail()
  email: string;

  @IsString()
  contact: string;

  @IsString()
  address: string;

  @IsString()
  country: string;
}
