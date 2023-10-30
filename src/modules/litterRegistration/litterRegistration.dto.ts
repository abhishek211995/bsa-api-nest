import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class SingleLitter {
  @ApiProperty()
  @IsString()
  litterName: string;

  @ApiProperty()
  @IsString()
  litterGender: string;

  @ApiProperty()
  @IsString()
  colorMark: string;
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
  mating_date: string;

  @ApiProperty()
  @IsString()
  owner_id: string; // id of dam owner

  @ApiProperty()
  @IsString()
  owner_name: string; // name of dam owner

  @ApiProperty()
  @IsString()
  sire_owner_id: number; // id of sire owner

  @ApiProperty()
  @IsString()
  meeting_date: string;

  @ApiProperty()
  @IsString()
  meeting_time: string;
}

export class ApproveLitterBody {
  @ApiProperty()
  @IsNumber()
  id: string;

  @ApiProperty()
  remarks: Array<{ message: string }>;
}
