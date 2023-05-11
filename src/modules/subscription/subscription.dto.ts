import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class BuySubscriptionDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  order_id: number;
}

export class GetUserSubscriptionQueries {
  @IsNumber()
  @IsOptional()
  user_id: number;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
