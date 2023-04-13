import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import * as dotenv from "dotenv";
import { CreateUserDto, LoginUserDto } from "./users.dto";
import { UsersService } from "./users.service";
dotenv.config();

@Controller("auth")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const res = await this.usersService.createUser(createUserDto);
      return { ...res };
    } catch (error) {
      if (error?.code === "ER_DUP_ENTRY") {
        return {
          statusCode: 400,
          message: "User already exists",
        };
      }
      throw error;
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
      console.log("users", users);
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
}
