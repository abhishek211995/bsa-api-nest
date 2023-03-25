import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto, LoginUserDto } from "./users.dto";
import { BreUser } from "./users.entity";
import * as bcrypt from "bcrypt";

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

@Injectable()
export class Bcrypt {
  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
