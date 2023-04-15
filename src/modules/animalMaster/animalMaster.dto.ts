import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class AnimalTypeDto {
  @IsString()
  @ApiProperty()
  animal_type_name: string;

  @IsString()
  @ApiProperty()
  animal_type_description: string;
}

export class EditAnimalTypePayload extends AnimalTypeDto {
  @IsNumber()
  @ApiProperty()
  animal_type_id: number;
}
