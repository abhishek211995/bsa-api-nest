import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { S3Service } from "src/lib/s3multer/s3.service";
import { fileFilter } from "src/utils/fileFilter.util";
import { Repository } from "typeorm";
import { UserStatus } from "../users/users.entity";
import { BreederDto } from "./breeder.dto";
import { BreBreeder } from "./breeder.entity";

@Injectable()
export class BreederService {
  constructor(
    @InjectRepository(BreBreeder)
    private readonly breederRepository: Repository<BreBreeder>,
    private readonly s3Service: S3Service,
  ) {}

  async createBreeder(
    breederDto: BreederDto,
    user,
    files: Array<Express.Multer.File>,
  ) {
    try {
      const newBreeder = await this.breederRepository.create({
        ...breederDto,
        user_id: user.id,
        breeder_license_expiry_date: new Date(
          breederDto.breeder_license_expiry_date,
        ),
      });
      const breeder = await this.breederRepository.save(newBreeder);

      if (breeder) {
        const breeder_license_doc = fileFilter(
          files,
          "breeder_license_doc_name",
        )[0];
        const uploadData = await this.s3Service.uploadSingle(
          breeder_license_doc,
          user.user_name,
        );
        const updatedBreeder = await this.updateBreederDoc(
          breeder.breeder_id,
          breeder_license_doc.originalname,
        );
        return { breeder, uploadData };
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async updateBreederDoc(breeder_id: number, doc_name: string) {
    try {
      const breeder = await this.breederRepository.findOne({
        where: { breeder_id: breeder_id },
      });
      breeder.breeder_license_doc_name = doc_name;
      const updatedBreeder = await this.breederRepository.save(breeder);
      return updatedBreeder;
    } catch (err) {
      throw err;
    }
  }

  async getBreeder(user_id: any) {
    try {
      const breeder = await this.breederRepository.findOne({
        where: { user_id: user_id },
        // relations: ["user"],
      });

      // let convertBreeder: BreBreeder & {
      //   user_status_info: string;
      //   idDoc: string;
      //   licenseDoc: string;
      // } = {
      //   ...breeder,
      //   user_status_info: UserStatus[breeder.user.user_status],
      //   idDoc: "",
      //   licenseDoc: "",
      // };

      // const licenseDoc = await this.s3Service.getLink(
      //   `${breeder.user.user_name}/${breeder.breeder_license_doc_name}`,
      // );
      // const idDoc = await this.s3Service.getLink(
      //   `${breeder.user.user_name}/${breeder.user.identity_doc_name}`,
      // );

      // convertBreeder = { ...convertBreeder, idDoc, licenseDoc };
      return breeder;
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
}
