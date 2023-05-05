import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  billing_address: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  cost_id: string;
}

export class CompleteOrderDto {
  @ApiProperty()
  payment_id: string;
  @ApiProperty()
  razorpay_order_id: string;
  @ApiProperty()
  order_id: string;
  @ApiProperty()
  razorpay_signature: string;
}
