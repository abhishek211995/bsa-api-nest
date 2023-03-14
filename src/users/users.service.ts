import { Injectable } from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./users.dto";
import { Users } from "./users.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  @ApiCreatedResponse({ type: CreateUserDto })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      a: {
        summary: "Example body",
        value: {
          user_name: "abhi",
          email: "abhi@gmail.com",
          password: "abhi1234",
        },
      },
    },
  })
  createUser(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  @ApiOperation({
    summary: "Gives a list of all users",
  })
  getUsers() {
    return this.usersRepository.find();
  }
}
