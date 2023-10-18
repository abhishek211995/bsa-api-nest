import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreCourses } from "./courses.entity";
import { CcavenueModule } from "../ccavenue/ccavenue.module";
import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";
import { S3Module } from "../../lib/s3multer/s3.module";

@Module({
  imports: [TypeOrmModule.forFeature([BreCourses]), CcavenueModule, S3Module],
  controllers: [CoursesController],
  providers: [Logger, CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
