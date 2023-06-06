import { ConflictException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as jwt from "jsonwebtoken";
import { ServiceException } from "src/exception/base-exception";
import { Bcrypt } from "src/lib/bcrypt/bcrypt.util";
import { EmailService } from "src/lib/mail/mail.service";
import { S3Service } from "src/lib/s3multer/s3.service";
import { BreRoleMaster } from "src/master/master.entity";
import { fileFilter } from "src/utils/fileFilter.util";
import { Repository } from "typeorm";
import { BreederService } from "../breeder/breeder.service";
import { IndividualUserDto, LoginUserDto } from "./users.dto";
import { BreUser, UserStatus } from "./users.entity";
import { GetUserSubscriptionQueries } from "../subscription/subscription.dto";
import { SubscriptionService } from "../subscription/subscription.service";
import { emailContainer, welcomeEmail } from "../../utils/mailTemplate.util";
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(BreUser)
    private readonly breUsersRepository: Repository<BreUser>,
    @InjectRepository(BreRoleMaster)
    private readonly breRoleRepository: Repository<BreRoleMaster>,
    private readonly breBreederService: BreederService,
    private bcryptService: Bcrypt,
    private readonly s3Service: S3Service,
    private readonly emailService: EmailService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  // generic
  async createIndividualUser(
    individualUser: IndividualUserDto,
    files: Array<Express.Multer.File>,
  ) {
    try {
      const password = await this.bcryptService.hashPassword(
        individualUser.password,
      );

      const existingUser = await this.breUsersRepository.findOne({
        where: { email: individualUser.email },
      });

      if (existingUser) {
        throw new ConflictException("User with this email already exists");
      }

      const newUser = this.breUsersRepository.create({
        ...individualUser,
        password,
      });

      const savedUser = await this.breUsersRepository.save(newUser);

      const identity_doc_name = fileFilter(files, "identity_doc_name")[0];

      await this.s3Service.uploadSingle(identity_doc_name, savedUser.email);

      const user = await this.updateUserDoc(
        newUser.id,
        identity_doc_name.originalname,
      );

      if (Number(savedUser.user_role_id) === 1) {
        await this.breBreederService.createBreeder(savedUser.id);
      }
      const message = emailContainer(
        welcomeEmail(user.user_name),
        "Welcome to Genuine Breeder Association",
      );

      await this.emailService.sendMail(
        user.email,
        "Welcome to Genuine Breeder Association",
        message,
      );
      return user;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Error while creating user",
        serviceErrorCode: "US-500",
      });
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.breUsersRepository.findOne({
        where: { email: email },
        relations: ["user_role_id"],
      });
      console.log("user", user);

      if (!user) {
        throw new ServiceException({
          message: "User not found",
          serviceErrorCode: "US",
          httpStatusCode: HttpStatus.BAD_REQUEST,
        });
      }
      let breederDetails = null;
      let subscription = [];
      // @ts-expect-error entity types
      if (user.user_role_id.role_id === 1) {
        breederDetails = await this.breBreederService.getBreeder(user.id);
      }

      subscription = await this.subscriptionService.getSubscriptions({
        is_active: "true",
        user_id: user.id,
      });

      // get link
      const identification_doc = await this.s3Service.getLink(
        `${user.email}/${user.identity_doc_name}`,
      );
      const profile_pic = await this.s3Service.getLink(
        `${user.email}/${user.profile_pic}`,
      );

      const isPasswordCorrect: boolean =
        await this.bcryptService.comparePassword(password, user.password);
      if (!isPasswordCorrect) {
        throw new ServiceException({
          message: "Incorrect password",
          serviceErrorCode: "US",
          httpStatusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      const token = jwt.sign({ user_id: user.id }, process.env.TOKEN_SECRET);
      const data = {
        ...user,
        identification_doc: identification_doc,
        profile_pic,
        breederDetails,
        subscription,
      };
      console.log("data", data);
      return { user: data, token };
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
        const role = await this.breRoleRepository.findOne({
          where: { role_id: roleId },
        });
        query.where = { user_role_id: role };
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
      let breederDetails = null;
      let subscription = [];
      // @ts-expect-error entity types
      if (user.user_role_id.role_id === 1) {
        breederDetails = await this.breBreederService.getBreeder(id);
      }

      subscription = await this.subscriptionService.getSubscriptions({
        is_active: "true",
        user_id: id,
      });
      // get link
      const identification_doc = await this.s3Service.getLink(
        `${user.email}/${user.identity_doc_name}`,
      );
      const profile_pic = await this.s3Service.getLink(
        `${user.email}/${user.profile_pic}`,
      );

      const data = {
        ...user,
        identification_doc: identification_doc,
        profile_pic,
        breederDetails,
        subscription,
      };
      return data;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Error while fetching user",
        serviceErrorCode: "US-500",
      });
    }
  }

  getUserByRoleId(roleId: any) {
    return this.breUsersRepository.findOne({
      where: {
        user_role_id: roleId,
      },
    });
  }

  async getUserByContact(contact_no: string) {
    try {
      const user = await this.breUsersRepository.findOneBy({
        contact_no: contact_no,
      });
      return user;
    } catch (error) {
      throw error;
    }
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
  async updateUserDetails(
    body: {
      user_id: number;
      user_name: string;
      user_address: string;
      identification_id_name: string;
      identification_id_no: string;
      contact_no: string;
    },
    files: Array<Express.Multer.File>,
  ) {
    try {
      const user = await this.breUsersRepository.findOne({
        where: { id: body.user_id },
      });
      if (!user) {
        throw new ServiceException({
          message: "User not found",
          serviceErrorCode: "US-404",
        });
      }
      const updatedUser = await this.breUsersRepository.update(
        { id: body.user_id },
        {
          user_name: body.user_name,
          user_address: body.user_address,
          identification_id_name: body.identification_id_name,
          identification_id_no: body.identification_id_no,
          contact_no: body.contact_no,
        },
      );
      if (files && files?.length > 0) {
        const identification_doc_name = fileFilter(
          files,
          "identification_doc_name",
        )[0];
        await this.s3Service.uploadSingle(identification_doc_name, user.email);
        const updateUserDoc = await this.updateUserDoc(
          user.id,
          identification_doc_name.originalname,
        );
      }

      return updatedUser;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Error while updating user details",
        serviceErrorCode: "US-500",
        httpStatusCode: 400,
      });
    }
  }

  async uploadProfileImage(files: Array<Express.Multer.File>, user_id: number) {
    try {
      const user = await this.breUsersRepository.findOne({
        where: { id: user_id },
      });
      if (!user) {
        throw new ServiceException({
          message: "User not found",
          serviceErrorCode: "US-404",
        });
      }
      const profile_pic = fileFilter(files, "profile_pic")[0];
      await this.s3Service.uploadSingle(profile_pic, user.email);
      const updateUserPic = await this.breUsersRepository.update(
        { id: user_id },
        { profile_pic: profile_pic.originalname },
      );
      return true;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Error while updating user details",
        serviceErrorCode: "US-500",
        httpStatusCode: 400,
      });
    }
  }

  async getUserDetailsWithSubscription(queries: GetUserSubscriptionQueries) {
    try {
      const user_data = await this.breBreederService.getBreeder(
        queries.user_id,
      );
      const subscription_data = await this.subscriptionService.getSubscriptions(
        queries,
      );
      const data = { ...user_data, subscription_data };
      return data;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Error while fetching user details",
        serviceErrorCode: "US-500",
        httpStatusCode: 400,
      });
    }
  }

  async testEmailService(to: string) {
    try {
      const message = emailContainer(
        welcomeEmail("Test"),
        "Welcome to Genuine Breeder Association",
      );

      await this.emailService.sendMail(
        to,
        "Welcome to Genuine Breeder Association",
        message,
      );
      return true;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Error while sending email",
        serviceErrorCode: "US-500",
        httpStatusCode: 400,
      });
    }
  }
}
