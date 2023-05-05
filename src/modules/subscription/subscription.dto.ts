import { IsBoolean, IsNumber } from "class-validator";

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
  user_id: number;

  @IsBoolean()
  is_active: boolean;
}
