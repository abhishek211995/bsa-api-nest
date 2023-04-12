import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import * as dotenv from "dotenv";
import { BreederService } from "src/modules/breeder/breeder.service";
import { CreateUserDto, LoginUserDto } from "./users.dto";
import { UsersService } from "./users.service";
import { BreUser } from "./users.entity";
import { BreederDto } from "../breeder/breeder.dto";
dotenv.config();

@Controller("auth")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Inject(BreederService)
  private readonly breederService: BreederService;

  @Post("register")
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const res = await this.usersService.createUser(createUserDto);
      if (res) {
        const user = new BreUser();
        user.id = res["id"];
        const breeder = new BreederDto();
        breeder.farm_id = createUserDto.farm_id;
        breeder.breeder_license_no = createUserDto.breeder_license_no;
        breeder.breeder_license_expiry_date =
          createUserDto.breeder_license_expiry_date;
        breeder.user_id = user;
        breeder.farm_name = createUserDto.farm_name;
        breeder.farm_address = createUserDto.farm_address;
        console.log(breeder);
        console.log("Hi");

        const breederRes = await this.breederService.createBreeder(
          breeder,
          user.id,
        );
        console.log(breederRes);

        if (breederRes) {
          return {
            statusCode: 201,
            message: "Breeder created successfully",
          };
        }
      }
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return {
          statusCode: 400,
          message: "User already exists",
        };
      } else {
        return {
          statusCode: 500,
          message: error.message,
        };
      }
    }
  }

  @Post("login")
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
  async getUsers() {
    try {
      const users = await this.usersService.getUsers();
      if (users) {
        return {
          statusCode: 200,
          message: "Users fetched successfully",
          data: users,
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Internal Server Error",
      };
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
      return {
        statusCode: 500,
        message: "Internal Server Error",
      };
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
