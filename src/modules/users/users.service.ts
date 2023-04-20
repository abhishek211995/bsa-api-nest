import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as jwt from "jsonwebtoken";
import { Bcrypt } from "src/lib/bcrypt/bcrypt.util";
import { Repository } from "typeorm";
import { CreateUserDto, LoginUserDto } from "./users.dto";
import { BreUser, UserStatus } from "./users.entity";
import { BreederService } from "../breeder/breeder.service";
import { BreederDto } from "../breeder/breeder.dto";
import { S3Service } from "src/lib/s3multer/s3.service";
import { fileFilter } from "src/utils/fileFilter.util";
import { BreederFarmService } from "../breederFarm/breederFarm.service";
import { ServiceException } from "src/exception/base-exception";
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(BreUser)
    private readonly breUsersRepository: Repository<BreUser>,
    private readonly breBreederService: BreederService,
    private bcryptService: Bcrypt,
    private readonly s3Service: S3Service,
    private readonly breederFarmService: BreederFarmService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    files: Array<Express.Multer.File>,
  ) {
    try {
      const password = await this.bcryptService.hashPassword(
        createUserDto.password,
      );

      const newUser = this.breUsersRepository.create({
        ...createUserDto,
        password,
      });

      const user = await this.breUsersRepository.save(newUser);

      const identity_doc = fileFilter(files, "identity_doc_name")[0];

      const uploadData = await this.s3Service.uploadSingle(
        identity_doc,
        user.user_name,
      );

      const updateUser = await this.updateUserDoc(
        newUser.id,
        identity_doc.originalname,
      );

      const breeder = new BreederDto();
      breeder.breeder_license_no = createUserDto.breeder_license_no;
      breeder.breeder_license_expiry_date =
        createUserDto.breeder_license_expiry_date;
      breeder.farm_address = createUserDto.farm_address;
      breeder.farm_name = createUserDto.farm_name;
      const breederDetails = await this.breBreederService.createBreeder(
        breeder,
        updateUser,
        files,
      );
      if (breederDetails) {
        const newFarm = await this.breederFarmService.createBreederFarm({
          breeder_id: breederDetails.breeder.breeder_id,
          farm_id: createUserDto.farm_id,
        });
        if (newFarm)
          console.log(
            "Breeder farm relation created for user id",
            user.id,
            newFarm,
          );
      }
      return { user, breederDetails };
    } catch (error) {
      throw error;
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.breUsersRepository.findOne({
        where: { email: email },
        loadRelationIds: true,
        relations: ["user_role_id"],
      });

      if (!user) {
        throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
      }

      const isPasswordCorrect: boolean =
        await this.bcryptService.comparePassword(password, user.password);
      if (!isPasswordCorrect) {
        throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
      }

      const token = jwt.sign({ foo: "bar" }, process.env.TOKEN_SECRET);
      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  async updateUserDoc(id: number, identity_doc_name: string) {
    try {
      const user = await this.breUsersRepository.findOne({ where: { id } });
      if (user) {
        user.identity_doc_name = identity_doc_name;
      }
      const updatedUser = await this.breUsersRepository.save(user);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async getUsers(roleId?: number) {
    try {
      const query = { where: {} };
      if (roleId) {
        query.where = { user_role_id: Number(roleId) };
      }

      const res = await this.breUsersRepository.find({
        ...query,
        relations: ["user_role_id"],
      });

      const list = this.convertUsers(res);
      return list;
    } catch (error) {
      console.log("error", JSON.stringify(error));
      throw error;
    }
  }

  convertUsers(users: BreUser[]) {
    return users.map((u) => ({ ...u, user_status: UserStatus[u.user_status] }));
  }

  async getUserById(id: number) {
    try {
      const user = await this.breUsersRepository.findOne({
        where: { id },
        relations: ["user_role_id"],
      });
      if (!user) {
        throw new ServiceException({
          message: "User not found",
          serviceErrorCode: "US-404",
        });
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  getUserByRoleId(roleId: any) {
    return this.breUsersRepository.findOne({
      where: {
        user_role_id: roleId,
      },
    });
  }

  getUserByContact(contact_no: string) {
    return this.breUsersRepository.findOneBy({ contact_no: contact_no });
  }

  async changeUserStatus(status: number, id: number, reason: string) {
    try {
      await this.getUserById(Number(id));
      const update = await this.breUsersRepository.update(
        { id: Number(id) },
        { user_status: status, reject_reason: reason },
      );

      return update;
    } catch (error) {
      throw error;
    }
  }
}
