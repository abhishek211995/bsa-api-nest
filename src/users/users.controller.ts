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
import { Bcrypt, UsersService } from "./users.service";
import { BreederService } from "src/breeder/breeder.service";
import { BreederDto } from "src/breeder/breeder.dto";
import { BreUser } from "./users.entity";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

@Controller("auth")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly bcryptService: Bcrypt,
  ) {}

  @Inject(BreederService)
  private readonly breederService: BreederService;

  @Post("register")
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await this.bcryptService.hashPassword(
        createUserDto.password,
      );
      const res = await this.usersService.createUser(createUserDto);
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
          message: error.message,
        };
      }
    }
  }

  @Post("login")
  @UsePipes(ValidationPipe)
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;

      const res = await this.usersService.loginUser(loginUserDto);

      if (res.length > 0) {
        const IspasswordCorrect: Promise<boolean> =
          this.bcryptService.comparePassword(password, res[0].password);
        if (IspasswordCorrect) {
          const jwtoken = jwt.sign({ foo: "bar" }, process.env.TOKEN_SECRET);

          return {
            statusCode: 200,
            message: "User Logged in successfully",
            data: res,
            token: jwtoken,
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
      console.log(error);

      return {
        statusCode: 500,
        message: error.message,
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
