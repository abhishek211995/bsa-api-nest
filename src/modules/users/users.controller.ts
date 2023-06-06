import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import * as dotenv from "dotenv";
import {
  ChangeStatusPayload,
  IndividualUserDto,
  LoginUserDto,
} from "./users.dto";
import { UsersService } from "./users.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { makeHTTPResponse } from "src/utils/httpResponse.util";
import { ApiOperation } from "@nestjs/swagger";
import { GetUserSubscriptionQueries } from "../subscription/subscription.dto";
import { async } from "rxjs";
dotenv.config();

@Controller("auth")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("individual")
  @UsePipes(ValidationPipe)
  @UseInterceptors(AnyFilesInterceptor())
  async createIndividualUser(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() IndividualUser: IndividualUserDto,
  ) {
    try {
      const res = await this.usersService.createIndividualUser(
        IndividualUser,
        files,
      );
      return makeHTTPResponse(res, 200, "User created successfully");
    } catch (err) {
      throw err;
    }
  }

  @Post("login")
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      const res = await this.usersService.loginUser(loginUserDto);
      return {
        statusCode: 200,
        message: "User Logged in successfully",
        data: res.user,
        token: res.token,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get("users")
  async getUsers(@Query("roleId") roleId: number) {
    try {
      const users = await this.usersService.getUsers(roleId);
      return {
        statusCode: 200,
        message: "Users fetched successfully",
        data: users,
      };
    } catch (error) {
      console.log("error", JSON.stringify(error));
      throw error;
    }
  }

  @Get("user")
  async getUserById(@Query("id") id: number) {
    try {
      if (!id) {
        return {
          statusCode: 400,
          message: "User id is required",
        };
      }
      const user = await this.usersService.getUserById(id);
      if (user) {
        return {
          statusCode: 200,
          message: "User fetched successfully",
          data: user,
        };
      } else {
        return {
          statusCode: 400,
          message: "User dose not exist",
        };
      }
    } catch (error) {
      throw error;
    }
  }

  @Get("userByContact")
  async getUserByContact(@Query("contact_no") contact_no: string) {
    try {
      const user = await this.usersService.getUserByContact(contact_no);
      console.log(user);

      if (user) {
        return {
          statusCode: 200,
          message: "User fetched successfully",
          data: user,
        };
      } else {
        return {
          statusCode: 400,
          message: "User dose not exist",
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
      };
    }
  }

  @Put("/change-status/:id")
  async changeUserStatus(
    @Param("id") id: number,
    @Body() body: ChangeStatusPayload,
  ) {
    try {
      const update = await this.usersService.changeUserStatus(
        body.status,
        id,
        body.reason,
      );
      return makeHTTPResponse(update, HttpStatus.OK, "Updated successfully");
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Update user details",
  })
  @Put("/update-user")
  @UseInterceptors(AnyFilesInterceptor())
  async updateUser(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body()
    body: {
      user_id: number;
      user_name: string;
      user_address: string;
      identification_id_name: string;
      identification_id_no: string;
      contact_no: string;
    },
  ) {
    try {
      const res = await this.usersService.updateUserDetails(body, files);
      return makeHTTPResponse(res, 200, "User details updated successfully");
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Upload user profile image",
  })
  @Post("/upload-profile-image")
  @UseInterceptors(AnyFilesInterceptor())
  async uploadProfileImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: { user_id: number },
  ) {
    try {
      const res = await this.usersService.uploadProfileImage(
        files,
        body.user_id,
      );
      return makeHTTPResponse(res, 200, "Profile image uploaded successfully");
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Get complete user details with subscription",
  })
  @Get("/user-details-with-subscription")
  async getUserDetailsWithSubscription(
    @Query() queries: GetUserSubscriptionQueries,
  ) {
    try {
      const res = await this.usersService.getUserDetailsWithSubscription(
        queries,
      );
      return makeHTTPResponse(res, 200, "User details fetched successfully");
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: "Test route for email",
  })
  @Post("/test-email-service")
  async testEmail(@Body() body: { to: string }) {
    try {
      const res = await this.usersService.testEmailService(body.to);
      return makeHTTPResponse(res, 200, "Email sent successfully");
    } catch (error) {
      throw error;
    }
  }
}
