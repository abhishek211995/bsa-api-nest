import { IsJSON, IsNumber, IsString } from "class-validator";

export class NewDraftDto {
  @IsString()
  draft_type: string;

  @IsNumber()
  user_id: number;

  @IsJSON()
  draft_values: Record<string, any>;
}
