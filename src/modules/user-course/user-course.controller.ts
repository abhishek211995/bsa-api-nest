import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from "@nestjs/common";
import { UserCourseService } from "./user-course.service";
import { makeHTTPResponse } from "../../utils/httpResponse.util";
import { CreateUserCourseDto } from "./user-course.dto";
import { CompleteCCAvenueOrderDto } from "../orders/orders.dto";
import { Response } from "express";

@Controller("userCourse")
export class UserCourseController {
  constructor(private readonly userCourseService: UserCourseService) {}

  @Get()
  async getUserCourses(
    @Query("userId") userId: string,
    @Query("id") id: string,
  ) {
    try {
      const list = await this.userCourseService.getUserCourses(userId, id);
      return makeHTTPResponse(list, HttpStatus.OK);
    } catch (error) {
      throw error;
    }
  }

  @Post("initiate")
  async initiateBuyCourse(@Body() body: CreateUserCourseDto) {
    try {
      const link = await this.userCourseService.buyCourse(
        body.userId,
        body.courseId,
        body.amount,
        body.userName,
        body.description,
        body.billingAddress,
      );
      return makeHTTPResponse(link, HttpStatus.OK);
    } catch (error) {
      throw error;
    }
  }

  @Post("completeBuy")
  async completeBuyCourse(
    @Body() body: CompleteCCAvenueOrderDto,
    @Res() response: Response,
  ) {
    try {
      console.log("completing buy course");
      const link = await this.userCourseService.completePayment(body);
      console.log("link", link);
      response.writeHead(301, { Location: link });
      response.end();
    } catch (error) {
      throw error;
    }
  }

  @Put("completeCourse/:id")
  async completeCourseForUser(@Param("id") id: string) {
    try {
      const update = await this.userCourseService.completeCourseForUser(id);

      return makeHTTPResponse(
        update,
        HttpStatus.OK,
        "Course Completed Successfully!",
      );
    } catch (error) {
      throw error;
    }
  }
}
