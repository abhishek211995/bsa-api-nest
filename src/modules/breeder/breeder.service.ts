import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServiceException } from "src/exception/base-exception";
import { Repository } from "typeorm";
import { BreederFarmService } from "../breederFarm/breederFarm.service";
import { BreBreeder } from "./breeder.entity";
import { S3Service } from "src/lib/s3multer/s3.service";

@Injectable()
export class BreederService {
  constructor(
    @InjectRepository(BreBreeder)
    private readonly breederRepository: Repository<BreBreeder>,
    private readonly breederFarmService: BreederFarmService,
    private readonly s3Service: S3Service,
  ) {}

  // async createBreeder(
  //   breederDto: BreederDto,
  //   user,
  //   files: Array<Express.Multer.File>,
  // ) {
  //   try {
  //     const newBreeder = await this.breederRepository.create({
  //       ...breederDto,
  //       user_id: user.id,
  //       breeder_license_expiry_date: new Date(
  //         breederDto.breeder_license_expiry_date,
  //       ),
  //     });
  //     const breeder = await this.breederRepository.save(newBreeder);

  //     if (breeder) {
  //       const breeder_license_doc = fileFilter(
  //         files,
  //         "breeder_license_doc_name",
  //       )[0];
  //       const uploadData = await this.s3Service.uploadSingle(
  //         breeder_license_doc,
  //         user.user_name,
  //       );
  //       const updatedBreeder = await this.updateBreederDoc(
  //         breeder.breeder_id,
  //         breeder_license_doc.originalname,
  //       );
  //       return { breeder, uploadData };
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     throw err;
  //   }
  // }

  async updateBreederDoc(breeder_id: number, doc_name: string) {
    try {
      const breeder = await this.breederRepository.findOne({
        where: { breeder_id: breeder_id },
      });
      // breeder.breeder_license_doc_name = doc_name;
      const updatedBreeder = await this.breederRepository.save(breeder);
      return updatedBreeder;
    } catch (err) {
      throw err;
    }
  }

  async getBreeder(user_id: number) {
    try {
      let breeder = await this.breederRepository.findOne({
        where: { user_id },
        relations: { user: true },
      });

      const identification_doc = await this.s3Service.getLink(
        `${breeder.user.user_name}/${breeder.user.identity_doc_name}`,
      );

      // @ts-expect-error
      breeder.user.identification_doc = identification_doc;

      const farms = await this.breederFarmService.getBreederFarms(
        breeder.breeder_id,
        breeder.user.user_name,
      );

      return { breeder, farms };
    } catch (err) {
      throw err;
    }
  }

  async getBreederList() {
    try {
      const list = await this.breederRepository.find({
        relations: ["user"],
      });

      return list;
    } catch (err) {
      throw err;
    }
  }

  async createBreeder(user_id: number) {
    try {
      let result = this.breederRepository.create({ user_id });
      result = await this.breederRepository.save({ user_id });
      return result;
    } catch (error) {
      console.log("failed to create breeder", error);
      throw new ServiceException({
        message: "Failed to create breeder entry",
        serviceErrorCode: "BS",
      });
    }
  }
}
