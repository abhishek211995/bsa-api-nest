import { Injectable } from "@nestjs/common";
import {
  ApiOperation,
} from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./users.dto";
import { BreUser } from "./users.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(BreUser)
    private readonly breUsersRepository: Repository<BreUser>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const newUser = this.breUsersRepository.create(createUserDto);
    return this.breUsersRepository.save(newUser);
  }

  @ApiOperation({
    summary: "Gives a list of all users",
  })
  getUsers() {
    return this.breUsersRepository.find();
  }
}
