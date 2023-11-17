import { IsNumber, IsString } from "class-validator";

export class TransferFarmDto {
  @IsNumber()
  old_owner_id: number;

  @IsNumber()
  new_owner_id: number;

  @IsNumber()
  farm_id: number;
}

export class ApproveRejectTransferFarmDto {
  @IsNumber()
  transfer_id: string;

  @IsString()
  request_rejection_reason: string;
}
