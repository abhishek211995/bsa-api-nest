import { IsArray, IsDate, IsNumber, IsString } from "class-validator";
import { BreUser } from "src/modules/users/users.entity";

export class BreederDto {
  @IsString()
  farm_id: string;

  @IsString()
  breeder_license_no: string;

  @IsString()
  breeder_license_doc_name: string;

  @IsString()
  farm_name: string;

  @IsString()
  farm_address: string;

  @IsString()
  breeder_license_expiry_date: string;

  @IsNumber()
  user_id: number;
}
