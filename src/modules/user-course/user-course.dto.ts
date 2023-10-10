import { ApiProperty } from "@nestjs/swagger";

export class CreateUserCourseDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  billingAddress: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  courseId: number;
}
