import { IsNumber, IsString } from "class-validator";
import { BreUser } from "src/modules/users/users.entity";

export class BreederDto {
  @IsNumber()
  farm_id: number;

  @IsString()
  breeder_license_no: string;

  @IsString()
  breeder_license_doc_name: string;

  @IsString()
  breeder_license_expiry_date: string;

  user_id: BreUser;

  @IsString()
  farm_name: string;

  @IsString()
  farm_address: string;
}
