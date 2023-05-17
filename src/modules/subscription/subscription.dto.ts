import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

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

  @IsString()
  @IsOptional()
  is_active: "true" | "false";
}
