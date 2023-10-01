import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { NewCourseDto } from "./courses.dto";
import { CoursesService } from "./courses.service";
import { makeHTTPResponse } from "../../utils/httpResponse.util";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async createCourse(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() course: NewCourseDto,
  ) {
    try {
      const result = await this.coursesService.createCourse(course, files);
      return makeHTTPResponse(
        result,
        HttpStatus.CREATED,
        "Course Created Successfully!",
      );
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getCourses(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    try {
      const list = await this.coursesService.getCourses(startDate, endDate);
      return makeHTTPResponse(list, HttpStatus.OK);
    } catch (error) {
      throw error;
    }
  }

  @Get(":id")
  async getCourseDetails(@Param("id") id: string) {
    try {
      const course = await this.coursesService.getSingleCourse(id);
      return makeHTTPResponse(course, HttpStatus.OK);
    } catch (error) {
      throw error;
    }
  }

  @Put(":id")
  @UseInterceptors(AnyFilesInterceptor())
  async updateCourse(
    @Param("id") id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: NewCourseDto,
  ) {
    try {
      const update = await this.coursesService.updateCourse(id, data, files);
      return makeHTTPResponse(update, HttpStatus.OK);
    } catch (error) {
      throw error;
    }
  }
}
