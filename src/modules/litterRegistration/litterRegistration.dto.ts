import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SingleLitter {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsString()
  color_mark: string;
}

export class LitterRegistrationBody {
  @ApiProperty()
  @IsString()
  dam_id: string;

  @ApiProperty()
  @IsString()
  dob: string;

  @ApiProperty({ isArray: true })
  litters: SingleLitter[];

  @ApiProperty()
  @IsString()
  sire_id: string;

  @ApiProperty()
  @IsString()
  owner_id: string; // id of dam owner

  @ApiProperty()
  @IsString()
  owner_name: string; // name of dam owner

  @ApiProperty()
  @IsString()
  meeting_date: string;

  @ApiProperty()
  @IsString()
  meeting_time: string;

  @ApiProperty()
  @IsString()
  otp: string;
}
