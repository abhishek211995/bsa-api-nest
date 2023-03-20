import { Injectable } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto, LoginUserDto } from "./users.dto";
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

  async loginUser(loginUserDto: LoginUserDto) {
    const email = loginUserDto.email;
    const user = await this.breUsersRepository.find({
      where: { email: email },
    });
    return user;
  }

  getUsers() {
    return this.breUsersRepository.find();
  }

  getUserById(id: number) {
    return this.breUsersRepository.findOneBy({ id: id });
  }
}
