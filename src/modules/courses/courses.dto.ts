import { IsBoolean, IsDate, IsNumber, IsString } from "class-validator";

export class NewCourseDto {
  @IsString()
  name: string;

  @IsString()
  syllabus: string;

  @IsNumber()
  fees: number;

  @IsDate()
  start_date: Date;

  @IsDate()
  end_date: Date;

  @IsBoolean()
  is_active: boolean;
}
