import { IsNumber, IsString } from "class-validator";

export class transferOwnerDto {
  @IsNumber()
  old_owner_id: number;

  @IsNumber()
  new_owner_id: number;

  @IsNumber()
  animal_id: number;

  @IsString()
  request_status: string;

  @IsString()
  request_rejection_reason: string;
}
