import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreUserCourses } from "./user-course.entity";
import { CcavenueModule } from "../ccavenue/ccavenue.module";
import { UserCourseController } from "./user-course.controller";
import { UserCourseService } from "./user-course.service";

@Module({
  imports: [TypeOrmModule.forFeature([BreUserCourses]), CcavenueModule],
  controllers: [UserCourseController],
  providers: [UserCourseService],
  exports: [UserCourseService],
})
export class UserCourseModule {}
