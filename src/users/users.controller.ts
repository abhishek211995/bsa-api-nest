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
import { CreateUserDto, LoginUserDto } from "./users.dto";
import { UsersService } from "./users.service";
import { BreederService } from "src/breeder/breeder.service";
import { BreederDto } from "src/breeder/breeder.dto";
import { BreUser } from "./users.entity";

@Controller("auth")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Inject(BreederService)
  private readonly breederService: BreederService;

  @Post("register")
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const res: Object = await this.usersService.createUser(createUserDto);
      if (res) {
        const user = new BreUser();
        user.id = res["id"];
        const breeder = new BreederDto();
        breeder.farm_id = createUserDto.farm_id;
        breeder.breeder_license_no = createUserDto.breeder_license_no;
        breeder.user_id = user;
        console.log(breeder);
        console.log("Hi");

        const breederRes = await this.breederService.createBreeder(breeder);
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
          message: "Internal Server Error",
        };
      }
    }
  }

  @Post("login")
  @UsePipes(ValidationPipe)
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      const res = await this.usersService.loginUser(loginUserDto);
      if (res.length > 0) {
        if (res[0].password == loginUserDto.password) {
          return {
            statusCode: 200,
            message: "User Logged in successfully",
            data: res,
          };
        } else {
          return {
            statusCode: 400,
            message: "Invalid credentials",
          };
        }
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
}
