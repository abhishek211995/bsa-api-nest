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
