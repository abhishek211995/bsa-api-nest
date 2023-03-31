import { IsNumber, IsString } from "class-validator";

export class SubscriptionDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  subscription_id: number;

  @IsString()
  subscription_start_date: string;

  @IsString()
  subscription_end_date: string;

  @IsNumber()
  Amount_paid: number;

  @IsString()
  subscription_status: string;
}
