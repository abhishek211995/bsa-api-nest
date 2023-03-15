import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreateUserDto } from "./users.dto";
import { UsersService } from "./users.service";
import { BreederService } from "src/breeder/breeder.service";
import { BreederDto } from "src/breeder/breeder.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  
  @Inject(BreederService)
  private readonly breederService: BreederService;

  @Post("create")
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const res: Object = await this.usersService.createUser(createUserDto);
      if (res) {
        const breeder = new BreederDto();
        breeder.farm_id = createUserDto.farm_id;
        breeder.breeder_license_no = createUserDto.breeder_license_no;
        breeder.user_id = res["id"];

        // const breederRes = await this.breederService.createBreeder(breeder);
        
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

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }
}
