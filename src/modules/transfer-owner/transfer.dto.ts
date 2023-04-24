import { IsNumber, IsString } from "class-validator";

export class TransferOwnerDto {
  @IsNumber()
  old_owner_id: number;

  @IsNumber()
  new_owner_id: number;

  @IsString()
  animal_id: string;

  @IsString()
  request_status: string;

  @IsString()
  request_rejection_reason: string;
}

export class ApproveRejectTransferDto {
  @IsNumber()
  transfer_id: number;

  @IsString()
  request_rejection_reason: string;
}
