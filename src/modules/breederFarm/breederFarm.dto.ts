import { IsString } from "class-validator";

export class BreederFarmDto {
  @IsString()
  farm_id: string;

  @IsString()
  breeder_id: number;
}
