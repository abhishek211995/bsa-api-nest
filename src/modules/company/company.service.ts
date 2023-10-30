import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BreCompany } from "./company.entity";
import { CreateCompanyDto } from "./company.dto";
import { ServiceException } from "../../exception/base-exception";
import TransactionUtil from "../../lib/db_utils/transaction.utils";
import { QueryRunner, Repository } from "typeorm";
import { BreUser, UserStatus } from "../users/users.entity";

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(BreCompany)
    private readonly companyRepository: Repository<BreCompany>,
    private transactionUtil: TransactionUtil,
  ) {}

  async createCompany(data: CreateCompanyDto) {
    try {
      const company = await this.transactionUtil.executeInTransaction(
        this.addCompany(data),
      );
      return company;
    } catch (error) {
      console.log("error while creating company", error);
      throw new ServiceException({
        message: "Error while creating company",
        serviceErrorCode: "CS-100",
      });
    }
  }

  addCompany(data: CreateCompanyDto) {
    return async (queryRunner: QueryRunner) => {
      try {
        const userPayload = {
          contact_no: data.contact,
          email: data.email,
          user_address: data.address,
          user_name: data.companyName,
          password: "",
          user_country: data.country,
          identification_id_name: data.companyName,
          identification_id_no: data.companyName,
          user_created_at: new Date(),
          user_updated_at: new Date(),
          user_status: UserStatus.Verified,
          reject_reason: "",
          user_role_id: 4,
        };
        let companyUser = queryRunner.manager.create(BreUser, userPayload);
        companyUser = await queryRunner.manager.save(BreUser, userPayload);
        // @ts-expect-error save should add id field to variable
        const companyPayload = { user_id: companyUser.id };
        queryRunner.manager.create(BreCompany, companyPayload);
        await queryRunner.manager.save(BreCompany, companyPayload);
        return companyUser;
      } catch (error) {
        console.log("error while creating company", error);
        queryRunner.rollbackTransaction();
        throw new ServiceException({
          message: "Error while creating company",
          serviceErrorCode: "CS-100",
        });
      }
    };
  }

  async getAllCompanies() {
    try {
      const list = await this.companyRepository.find({ relations: ["user"] });
      return list;
    } catch (error) {
      console.log("error while getting companies", error);
      throw new ServiceException({
        message: "Failed to get companies",
        serviceErrorCode: "CS-100",
      });
    }
  }
}
