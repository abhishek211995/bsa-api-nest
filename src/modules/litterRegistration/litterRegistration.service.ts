import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { litterSireVerification } from "src/constants/otp.reasons.constant";
import { ServiceException } from "src/exception/base-exception";
import { EmailService } from "src/lib/mail/mail.service";
import {
  litterRegistrationRequest,
  sireOwnerVerificationEmail,
} from "src/utils/mailTemplate.util";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { LitterRegistrationBody } from "./litterRegistration.dto";
import { BreLitterRegistration } from "./litterRegistration.entity";
import { BreAnimal } from "../animal/animal.entity";
import { generateRegNo } from "src/utils/generateReg.util";
import { v4 as uuidv4 } from "uuid";
import { animalRegistrationSource } from "src/constants/animal_registration.constant";
import {
  crypt,
  decrypt,
  decryptNumber,
  encryptNumber,
} from "src/utils/encryption";

@Injectable()
export class LitterRegistrationService {
  constructor(
    @InjectRepository(BreLitterRegistration)
    private readonly litterRegistrationRepository: Repository<BreLitterRegistration>,
    @InjectRepository(BreAnimal)
    private readonly animalRepository: Repository<BreAnimal>,
    private readonly userService: UsersService,
    private readonly mailService: EmailService,
  ) {}

  async registerLitter(body: LitterRegistrationBody) {
    try {
      const payload = {
        litters: body.litters,
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
          {
            message: "Verification call scheduled",
            user_name: body.owner_name,
          },
        ],
      };

      this.litterRegistrationRepository.create(payload);
      const registration = await this.litterRegistrationRepository.save(
        payload,
      );
      const getLitter = await this.litterRegistrationRepository.findOne({
        where: { id: registration.id },
        relations: ["owner", "sire_owner"],
      });

      const sire = await this.animalRepository.findOne({
        where: { animal_id: getLitter.sire_id },
      });
      const encryptId = encryptNumber(getLitter.id);
      const link = `${process.env.WEB_URL}/litterRegistration?requestId=${encryptId}`;

      if (getLitter) {
        const message = litterRegistrationRequest(
          getLitter.sire_owner.user_name,
          sire.animal_name,
          getLitter.owner.user_name,
          link,
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

  async getAllLitters() {
    try {
      let list = await this.litterRegistrationRepository.find({
        // where: { completed: false },
        relations: ["owner", "sire_owner"],
      });
      // @ts-expect-error changing number to string
      list = list.map((l) => ({ ...l, id: encryptNumber(l.id) }));
      return list;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to fetch",
        serviceErrorCode: "LRS-105",
        httpStatusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async getLitterDetailsById(id: string, body?: any) {
    try {
      const decryptedId = decryptNumber(id);
      const list = await this.litterRegistrationRepository.findOne({
        where: { id: decryptedId },
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
      console.log("sadjgasjd", body?.user?.user_role_id?.role_id);

      if (body?.user?.user_role_id?.role_id !== 3)
        if (list.sire_owner_id !== body?.user?.id) {
          throw new ServiceException({
            message: "You are not authorized to view this litter",
            serviceErrorCode: "LRS-105",
            httpStatusCode: HttpStatus.BAD_REQUEST,
          });
        }

      return list;
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
      const decryptedId = decryptNumber(body.id);
      const update = await this.litterRegistrationRepository.update(
        { id: decryptedId },
        { completed: true, remarks: body.remarks },
      );
      const litterDetails = await this.getLitterDetailsById(body.id, body);
      const animalsCount = await this.animalRepository.count();
      const animals = litterDetails.litters.map((l, index) => {
        const damPedigree = litterDetails.dam.animal_pedigree;
        const sirePedigree = litterDetails.sire.animal_pedigree;
        const animal_id = uuidv4();
        const animalPedigree: Record<string, any> = {
          name: l.litterName,
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
          animal_name: l.litterName,
          // @ts-expect-error because of relation in animal table
          animal_type_id: litterDetails.dam.animal_breed_id.animal_type_id,
          animal_breed_id: litterDetails.dam.animal_breed_id,
          animal_color_and_markings: l.colorMark,
          animal_gender: l.litterGender,
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
      const decryptedId = decryptNumber(id);

      const update = await this.litterRegistrationRepository.update(
        { id: decryptedId },
        { remarks },
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
      const decryptedId = decryptNumber(id);
      const date = new Date();
      await this.litterRegistrationRepository.update(
        { id: decryptedId },
        {
          sire_approval: true,
          sire_action_taken: true,
          sire_action_time: date,
          remarks,
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
      const decryptedId = decryptNumber(id);
      const date = new Date();
      await this.litterRegistrationRepository.update(
        { id: decryptedId },
        {
          sire_approval: false,
          sire_action_taken: true,
          sire_action_time: date,
          sire_rejection_reason: reason,
          remarks,
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
}
