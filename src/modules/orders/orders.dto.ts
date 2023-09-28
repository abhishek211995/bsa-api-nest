import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  user_name: string;

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

export class CompleteCCAvenueOrderDto {
  @ApiProperty()
  encResp: string;

  @ApiProperty()
  orderNo: string;
}

export type CCAvenueResponse = {
  order_id: string;
  tracking_id: string;
  bank_ref_no: string;
  order_status: string;
  failure_message: string;
  payment_mode: string;
  card_name: string;
  status_code: string;
  status_message: string;
  currency: string;
  amount: string;
  billing_name: string;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  billing_country: string;
  billing_tel: string;
  billing_email: string;
  delivery_name: string;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_zip: string;
  delivery_country: string;
  delivery_tel: string;
  merchant_param1: string;
  merchant_param2: string;
  merchant_param3: string;
  merchant_param4: string;
  merchant_param5: string;
  vault: string;
  offer_type: string;
  offer_code: string;
  discount_value: string;
  mer_amount: string;
  eci_value: string;
  retry: string;
  response_code: string;
  billing_notes: string;
  trans_date: string;
  bin_country: string;
};
