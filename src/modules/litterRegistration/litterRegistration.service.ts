import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { animalRegistrationSource } from "src/constants/animal_registration.constant";
import { ServiceException } from "src/exception/base-exception";
import { EmailService } from "src/lib/mail/mail.service";
import { S3Service } from "src/lib/s3multer/s3.service";
import { generateRegNo } from "src/utils/generateReg.util";
import {
  emailContainer,
  litterRegistrationRequest,
} from "src/utils/mailTemplate.util";
import { QueryRunner, Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { fileFilter } from "../../utils/fileFilter.util";
import { BreAnimal } from "../animal/animal.entity";
import { UsersService } from "../users/users.service";
import { LitterRegistrationBody } from "./litterRegistration.dto";
import { BreLitterRegistration, BreLitters } from "./litterRegistration.entity";
import TransactionUtil from "../../lib/db_utils/transaction.utils";

@Injectable()
export class LitterRegistrationService {
  constructor(
    @InjectRepository(BreLitterRegistration)
    private readonly litterRegistrationRepository: Repository<BreLitterRegistration>,
    @InjectRepository(BreAnimal)
    private readonly animalRepository: Repository<BreAnimal>,
    private readonly userService: UsersService,
    private readonly mailService: EmailService,
    @InjectRepository(BreLitters)
    private readonly littersRepository: Repository<BreLitters>,
    private readonly s3Service: S3Service,
    private transactionUtil: TransactionUtil,
  ) {}

  async registerLitter(body: LitterRegistrationBody) {
    try {
      const payload = {
        dob: body.dob,
        meeting_date: body.meeting_date,
        meeting_time: body.meeting_time,
        sire_id: body.sire_id,
        dam_id: body.dam_id,
        owner_id: body.owner_id,
        sire_owner_id: body.sire_owner_id,
        mating_date: body.mating_date,
        completed: false,
        remarks: [
          JSON.stringify({
            message: "Verification call scheduled",
            user_name: body.owner_name,
          }),
        ],
      };

      this.litterRegistrationRepository.create(payload);
      const registration = await this.litterRegistrationRepository.save(
        payload,
      );

      // Adding litters to new table of bre_litters
      const litters = body.litters.map((l) => {
        return {
          litter_name: l.litterName,
          litter_color_mark: l.colorMark,
          litter_gender: l.litterGender,
          litter_registration_id: registration.id,
        };
      });
      const data = await this.littersRepository.insert(litters);

      const getLitter = await this.litterRegistrationRepository.findOne({
        where: { id: registration.id },
        relations: ["owner", "sire_owner"],
      });

      const sire = await this.animalRepository.findOne({
        where: { animal_id: getLitter.sire_id },
      });
      const link = `${process.env.WEB_URL}/litterRegistration?requestId=${getLitter.id}`;

      if (getLitter) {
        const message = emailContainer(
          litterRegistrationRequest(
            getLitter.sire_owner.user_name,
            sire.animal_name,
            getLitter.owner.user_name,
            link,
          ),
          "Sire Confirmation Request Received",
        );

        await this.mailService.sendMail(
          getLitter.sire_owner.email,
          "Sire Confirmation Request Received",
          message,
        );
      }

      return getLitter;
    } catch (error) {
      throw error instanceof ServiceException
        ? error
        : new ServiceException({
            message: error?.message ?? "Failed to add litter",
            serviceErrorCode: "LRS-100",
          });
    }
  }

  async registerLitterSemen(
    body: LitterRegistrationBody,
    files: Array<Express.Multer.File>,
  ) {
    try {
      const registration = await this.transactionUtil.executeInTransaction(
        this.addLitter(body, files),
      );

      return registration;
    } catch (error) {
      throw error instanceof ServiceException
        ? error
        : new ServiceException({
            message: error?.message ?? "Failed to add semen litter",
            serviceErrorCode: "LRS-100",
          });
    }
  }

  addLitter(body: LitterRegistrationBody, files: Array<Express.Multer.File>) {
    return async (queryRunner: QueryRunner) => {
      try {
        await this.s3Service.uploadMultiple(files);
        const semenBill = fileFilter(files, "semenBill")[0].originalname;
        const vetCertificate = fileFilter(files, "vetCertificate")[0]
          .originalname;
        const payload = {
          dob: body.dob,
          meeting_date: body.meeting_date,
          meeting_time: body.meeting_time,
          sire_id: null,
          dam_id: body.dam_id,
          owner_id: body.owner_id,
          sire_owner_id: null,
          mating_date: body.mating_date,
          completed: false,
          remarks: [
            JSON.stringify({
              message: "Verification call scheduled",
              user_name: body.owner_name,
            }),
          ],
          semen_bill: semenBill,
          vet_certificate: vetCertificate,
          is_semen: true,
        };

        let registration = queryRunner.manager.create(
          BreLitterRegistration,
          payload,
        );

        registration = await queryRunner.manager.save(
          BreLitterRegistration,
          payload,
        );

        // @ts-expect-error using common type class for normal litter and semen litter
        const parseLitters = JSON.parse(body.litters);
        const litters = parseLitters.map((l) => {
          return {
            litter_name: l.litterName,
            litter_color_mark: l.colorMark,
            litter_gender: l.litterGender,
            litter_registration_id: registration.id,
          };
        });

        await queryRunner.manager.insert(BreLitters, litters);

        return registration;
      } catch (error) {
        console.log("error in create litter transaction", error);
        queryRunner.rollbackTransaction();
      }
    };
  }

  async getAllLitters() {
    try {
      const list = await this.litterRegistrationRepository.find({
        relations: ["owner", "sire_owner"],
        order: {
          updated_at: "ASC",
        },
      });
      console.log(list);

      // replace litters json with litters from table bre_litters
      const litters = await this.littersRepository.find();
      const data = list.map((l) => {
        const litter = litters.filter(
          (litter) => litter.litter_registration_id === l.id,
        );
        console.log(litter);

        return { ...l, litters: litter };
      });
      return data;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to fetch",
        serviceErrorCode: "LRS-101",
        httpStatusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async getLitterDetailsById(id: string, body?: any) {
    try {
      const list = await this.litterRegistrationRepository.findOne({
        where: { id: Number(id) },
        relations: [
          "owner",
          "dam",
          "dam.animal_type_id",
          "dam.animal_owner_id",
          "dam.animal_breed_id",
          "sire",
          "sire.animal_owner_id",
        ],
      });

      if (!list) {
        throw new ServiceException({
          message: "Litter not found",
          serviceErrorCode: "LRS-102",
          httpStatusCode: HttpStatus.BAD_REQUEST,
        });
      }
      const semenBillLink = await this.s3Service.getLink(list.semen_bill);
      const vetCertificateLink = await this.s3Service.getLink(
        list.vet_certificate,
      );
      if (body?.user?.user_role_id?.role_id !== 3)
        if (list.sire_owner_id !== body?.user?.id) {
          throw new ServiceException({
            message: "You are not authorized to view this litter",
            serviceErrorCode: "LRS-105",
            httpStatusCode: HttpStatus.BAD_REQUEST,
          });
        }
      const litters = await this.littersRepository.find({
        where: { litter_registration_id: Number(id) },
      });

      const data = {
        ...list,
        litters: litters,
        semenBillLink,
        vetCertificateLink,
      };
      return data;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to fetch",
        serviceErrorCode: "LRS-105",
        httpStatusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async approveLitter(body: any) {
    try {
      const update = await this.litterRegistrationRepository.update(
        { id: body.id },
        { completed: true, remarks: body.remarks },
      );
      const litterDetails = await this.getLitterDetailsById(body.id, body);
      const animalsCount = await this.animalRepository.count();

      const AllLitters = await this.littersRepository.find({
        where: { litter_registration_id: body.id },
      });
      const animals = AllLitters.map((l, index) => {
        const damPedigree = litterDetails.dam.animal_pedigree;
        const sirePedigree = litterDetails.sire.animal_pedigree;
        const animal_id = uuidv4();
        const animalPedigree: Record<string, any> = {
          name: l.litter_name,
          attributes: {
            uuid: animal_id,
            level: 0,
            parentType: "",
          },
          children: [],
        };
        if (damPedigree) {
          animalPedigree.children.push(damPedigree);
        } else {
          animalPedigree.children.push({
            name: litterDetails.dam.animal_name,
            attributes: {
              uuid: litterDetails.dam.animal_id,
              level: 1,
              parentType: "Dam",
            },
          });
        }
        if (sirePedigree) {
          animalPedigree.children.push(sirePedigree);
        } else {
          animalPedigree.children.push({
            name: litterDetails.sire.animal_name,
            attributes: {
              uuid: litterDetails.sire.animal_id,
              level: 1,
              parentType: "Sire",
            },
          });
        }
        return {
          animal_id,
          animal_name: l.litter_name,
          // @ts-expect-error because of relation in animal table
          animal_type_id: litterDetails.dam.animal_breed_id.animal_type_id,
          animal_breed_id: litterDetails.dam.animal_breed_id,
          animal_color_and_markings: l.litter_color_mark,
          animal_gender: l.litter_gender,
          animal_date_of_birth: litterDetails.dob,
          animal_owner_id: Number(litterDetails.owner_id),
          animal_registration_number: generateRegNo(
            // @ts-expect-error because of relation in animal table
            litterDetails.dam.animal_breed_id.animal_breed_id,
            animalsCount + index + 1,
          ),
          animal_sire_id: litterDetails.sire_id,
          animal_dam_id: litterDetails.dam_id,
          animal_pedigree: animalPedigree,
          is_active: true,
          registration_source: animalRegistrationSource.litter,
        };
      });
      const animalsAdded = await this.animalRepository.insert(animals);
      return animalsAdded.generatedMaps.length;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to approve litter",
        serviceErrorCode: "LRS",
      });
    }
  }

  async rejectLitter(id: string, remarks: Array<{ message: string }>) {
    try {
      const remark = remarks.map((remark) => {
        return JSON.stringify(remark);
      });
      const update = await this.litterRegistrationRepository.update(
        { id: Number(id) },
        { remarks: remark },
      );
      return update.affected;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to reject litter",
        serviceErrorCode: "LRS",
      });
    }
  }

  async sireApproval(id: string, remarks: Array<{ message: string }>) {
    try {
      const date = new Date();
      const remark = remarks.map((remark) => {
        return JSON.stringify(remark);
      });
      await this.litterRegistrationRepository.update(
        { id: Number(id) },
        {
          sire_approval: true,
          sire_action_taken: true,
          sire_action_time: date,
          remarks: remark,
        },
      );
      return true;
    } catch (error) {
      return new ServiceException({
        message: error?.message ?? "Failed to approve litter from sire owner",
        serviceErrorCode: "LRS",
      });
    }
  }

  async sireRejection({
    id,
    reason,
    remarks,
  }: {
    id: string;
    reason: string;
    remarks: Array<{ message: string }>;
  }) {
    try {
      const date = new Date();
      const remark = remarks.map((remark) => {
        return JSON.stringify(remark);
      });
      await this.litterRegistrationRepository.update(
        { id: Number(id) },
        {
          sire_approval: false,
          sire_action_taken: true,
          sire_action_time: date,
          sire_rejection_reason: reason,
          remarks: remark,
        },
      );
      return true;
    } catch (error) {
      return new ServiceException({
        message: error?.message ?? "Failed to reject litter from sire owner",
        serviceErrorCode: "LRS",
      });
    }
  }

  async updateSemenSireCompany(companyId: number, litterId: number) {
    try {
      const result = await this.litterRegistrationRepository.update(
        { id: litterId },
        { sire_owner_id: companyId },
      );
      return result;
    } catch (error) {
      console.log("error while updating litter company", error);
      throw new ServiceException({
        message: "Failed to update litter sire company",
        serviceErrorCode: "LRS-400",
      });
    }
  }

  async updateSemenSireAnimal(animalId: string, litterId: number) {
    try {
      const result = await this.litterRegistrationRepository.update(
        { id: litterId },
        { sire_id: animalId },
      );
      return result;
    } catch (error) {
      console.log("error while updating litter sire", error);
      throw new ServiceException({
        message: "Failed to update litter sire sire",
        serviceErrorCode: "LRS-400",
      });
    }
  }
}
