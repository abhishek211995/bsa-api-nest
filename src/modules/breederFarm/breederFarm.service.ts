import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServiceException } from "src/exception/base-exception";
import TransactionUtil from "src/lib/db_utils/transaction.utils";
import { S3Service } from "src/lib/s3multer/s3.service";
import { fileFilter } from "src/utils/fileFilter.util";
import { InsertResult, QueryRunner, Repository } from "typeorm";
import { BreUser } from "../users/users.entity";
import { BreederFarmDto, CreateBreederFarmDto } from "./breederFarm.dto";
import { BreBreederFarm } from "./breederFarm.entity";

@Injectable()
export class BreederFarmService {
  constructor(
    @InjectRepository(BreBreederFarm)
    private breederFarmRepository: Repository<BreBreederFarm>,
    @InjectRepository(BreUser)
    private userRepository: Repository<BreUser>,
    private transactionUtils: TransactionUtil,
    private readonly s3Service: S3Service, // private readonly userService: UsersService,
  ) {}

  async createBreederFarm(breederFarmDto: BreederFarmDto) {
    try {
      const farmIds = JSON.parse(breederFarmDto.farm_id) as number[];

      if (farmIds.length === 0) {
        return;
      }
      const data = farmIds.map((f) => ({
        farm_id: f,
        breeder_id: breederFarmDto.breeder_id,
      }));

      const result = await this.transactionUtils.executeInTransaction(
        this.upsertFarmRelations(data),
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  upsertFarmRelations(data: { farm_id: number; breeder_id: number }[]) {
    try {
      return async function (queryRunner: QueryRunner): Promise<InsertResult> {
        const upsertResult = await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(BreBreederFarm)
          .values(data)
          .execute();
        return upsertResult;
      };
    } catch (error) {
      throw error;
    }
  }

  async addBreederFarm(
    data: CreateBreederFarmDto,
    files: Array<Express.Multer.File>,
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: data.user_id },
      });
      let breederFarm = this.breederFarmRepository.create({
        breeder_id: data.breeder_id,
        farm_address: data.farm_address,
        farm_id: data.farm_id,
        farm_name: data.farm_name,
        license_expiry_date: data.license_expiry_date,
        license_no: data.license_no,
      });
      breederFarm = await this.breederFarmRepository.save({
        breeder_id: data.breeder_id,
        farm_address: data.farm_address,
        farm_id: data.farm_id,
        farm_name: data.farm_name,
        license_expiry_date: data.license_expiry_date,
        license_no: data.license_no,
      });

      const logo = fileFilter(files, "logo")[0];
      await this.s3Service.uploadSingle(logo, user.user_name);

      await this.breederFarmRepository.update(
        { breeder_id: data.breeder_id },
        { logo },
      );

      return breederFarm;
    } catch (error) {
      console.log("error while adding breeder farm", error);
      throw new ServiceException({
        message: "Failed to add farm",
        serviceErrorCode: "BFS",
      });
    }
  }

  async getBreederFarms(breeder_id: number, user_name: string) {
    try {
      let farms = await this.breederFarmRepository.find({
        where: {
          breeder_id,
        },
      });

      farms = await Promise.all(
        farms.map(async (f) => {
          const logo = await this.s3Service.getLink(`${user_name}/${f.logo}`);
          f.logo = logo;
          return f;
        }),
      );

      return farms;
    } catch (error) {
      throw new ServiceException({
        message: "Failed to fetch breeder farms",
        serviceErrorCode: "BFS",
      });
    }
  }
}
