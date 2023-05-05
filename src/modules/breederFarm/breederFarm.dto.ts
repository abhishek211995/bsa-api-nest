import { IsDate, IsNumber, IsString } from "class-validator";

export class BreederFarmDto {
  @IsString()
  farm_id: string;

  @IsString()
  breeder_id: number;
}

export class CreateBreederFarmDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  breeder_id: number;

  @IsNumber()
  farm_id: number;

  @IsString()
  farm_name: string;

  @IsString()
  farm_address: string;

  @IsString()
  license_no: string;

  @IsDate()
  license_expiry_date: Date;
}
