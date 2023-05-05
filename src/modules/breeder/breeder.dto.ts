import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsNumber, IsString } from "class-validator";
import { BreUser, UserStatus } from "src/modules/users/users.entity";

export class BreederDto {
  @IsString()
  farm_id: string;

  @IsString()
  breeder_license_no: string;

  // @IsString()
  breeder_license_doc_name: string;

  @IsString()
  farm_name: string;

  @IsString()
  farm_address: string;

  @IsString()
  breeder_license_expiry_date: string;
  user_id: BreUser;
}

export class FarmTypes {
  @IsString()
  farm_name: string;

  @IsString()
  farm_address: string;

  @IsString()
  license_no: string;

  @IsDate()
  license_expiry_date: Date;
}
export class CreateBreederDto {
  @IsNumber()
  user_id: number;

  @ApiProperty()
  @IsArray()
  farm: FarmTypes;
}
