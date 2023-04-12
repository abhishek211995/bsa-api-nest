import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as jwt from "jsonwebtoken";
import { Bcrypt } from "src/lib/bcrypt/bcrypt.util";
import { Repository } from "typeorm";
import { CreateUserDto, LoginUserDto } from "./users.dto";
import { BreUser } from "./users.entity";
import { BreederService } from "../breeder/breeder.service";
import { BreederDto } from "../breeder/breeder.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(BreUser)
    private readonly breUsersRepository: Repository<BreUser>,
    private readonly breBreederService: BreederService,
    private bcryptService: Bcrypt,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const password = await this.bcryptService.hashPassword(
        createUserDto.password,
      );
      const newUser = this.breUsersRepository.create({
        ...createUserDto,
        password,
      });
      const user = await this.breUsersRepository.save(newUser);
      const breeder = new BreederDto();
      breeder.farm_id = createUserDto.farm_id;
      breeder.breeder_license_no = createUserDto.breeder_license_no;
      breeder.breeder_license_expiry_date =
        createUserDto.breeder_license_expiry_date;
      breeder.farm_address = createUserDto.farm_address;
      breeder.farm_name = createUserDto.farm_name;
      const breederDetails = await this.breBreederService.createBreeder(
        breeder,
        user.id,
      );

      return { user, breederDetails };
    } catch (error) {
      throw error;
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.breUsersRepository.findOne({
      where: { email: email },
      loadRelationIds: true,
      relations: ["user_role_id"],
    });

    if (!user) {
      throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
    }

    const isPasswordCorrect: boolean = await this.bcryptService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
    }

    const token = jwt.sign({ foo: "bar" }, process.env.TOKEN_SECRET);
    return { user, token };
  }

  getUsers() {
    return this.breUsersRepository.find();
  }

  getUserById(id: number) {
    return this.breUsersRepository.findOneBy({ id: id });
  }

  getUserByContact(contact_no: string) {
    return this.breUsersRepository.findOneBy({ contact_no: contact_no });
  }
}
