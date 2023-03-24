import { IsNumber, IsString } from "class-validator";
import { BreUser } from "src/users/users.entity";

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
}
