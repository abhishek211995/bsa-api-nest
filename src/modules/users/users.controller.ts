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
  CreateUserDto,
  IndividualUserDto,
  LoginUserDto,
} from "./users.dto";
import { UsersService } from "./users.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { makeHTTPResponse } from "src/utils/httpResponse.util";
dotenv.config();

@Controller("auth")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post("register")
  // @HttpCode(200)
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(AnyFilesInterceptor())
  // async createUser(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @Body() createUserDto: CreateUserDto,
  // ) {
  //   try {
  //     const res = await this.usersService.createUser(createUserDto, files);

  //     return { ...res };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

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

      return {
        status: 201,
        data: res.user,
        message: "User Created Successfully",
      };
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

  //! get otp api is not used anymore
  // @Get("getOTP")
  // async getOTP(@Query("email") email: string) {
  //   try {
  //     const res = await this.usersService.getOTP(email);
  //     return makeHTTPResponse(res, HttpStatus.OK, "OTP sent successfully");
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
