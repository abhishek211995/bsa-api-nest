import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { litterSireVerification } from "src/constants/otp.reasons.constant";
import { ServiceException } from "src/exception/base-exception";
import { EmailService } from "src/lib/mail/mail.service";
import { generateOtp } from "src/utils/generateOtp";
import { sireOwnerVerificationEmail } from "src/utils/mailTemplate.util";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { LitterRegistrationBody } from "./litterRegistration.dto";
import {
  BreLitterRegistration,
  BreOtpMapping,
} from "./litterRegistration.entity";
import { BreAnimal } from "../animal/animal.entity";
import { generateRegNo } from "src/utils/generateReg.util";
import { v4 as uuidv4 } from "uuid";
import { animalRegistrationSource } from "src/constants/animal_registration.constant";

@Injectable()
export class LitterRegistrationService {
  constructor(
    @InjectRepository(BreLitterRegistration)
    private readonly litterRegistrationRepository: Repository<BreLitterRegistration>,
    @InjectRepository(BreOtpMapping)
    private readonly otpRepository: Repository<BreOtpMapping>,
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
        otp: body.otp,
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

      return registration;
    } catch (error) {
      throw error instanceof ServiceException
        ? error
        : new ServiceException({
            message: error?.message ?? "Failed to add litter",
            serviceErrorCode: "LRS-100",
          });
    }
  }

  async sendOtpToSireOwner(sire_owner_id: number, req_username: string) {
    try {
      const user = await this.userService.getUserById(sire_owner_id);
      const otp = generateOtp();
      const message = sireOwnerVerificationEmail(
        user.user_name,
        otp,
        req_username,
      );
      const currentDate = new Date();
      // Add 30 minutes
      currentDate.setMinutes(currentDate.getMinutes() + 30);

      await this.otpRepository.insert([
        {
          otp,
          reason: litterSireVerification,
          user_id: user.id,
          validity: currentDate,
        },
      ]);
      await this.mailService.sendMail(
        user.email,
        "Litter Registration Verification",
        message,
      );

      return otp;
    } catch (error) {
      throw error instanceof ServiceException
        ? error
        : new ServiceException({
            message: error?.message ?? "Failed to send otp to sire owner",
            serviceErrorCode: "LRS-100",
          });
    }
  }

  async verifyOtp(user_id: number, otp: number) {
    try {
      const existingOtp = await this.otpRepository.findOne({
        where: { user_id, reason: litterSireVerification },
      });

      if (!existingOtp) {
        throw new ServiceException({
          message: "OTP not found",
          serviceErrorCode: "LRS-104",
          httpStatusCode: HttpStatus.BAD_REQUEST,
        });
      }

      if (new Date() > existingOtp.validity) {
        throw new ServiceException({
          message: "OTP expired",
          serviceErrorCode: "LRS-104",
          httpStatusCode: HttpStatus.BAD_REQUEST,
        });
      }

      if (otp !== existingOtp.otp) {
        throw new ServiceException({
          message: "Invalid OTP",
          serviceErrorCode: "LRS-104",
          httpStatusCode: HttpStatus.BAD_REQUEST,
        });
      }

      if (otp === existingOtp.otp) {
        await this.otpRepository.update(
          { id: existingOtp.id },
          { verified: true },
        );

        return existingOtp;
      }
    } catch (error) {
      throw new ServiceException({
        message: "OTP not found",
        serviceErrorCode: "LRS-104",
        httpStatusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async getAllLitters() {
    try {
      const list = await this.litterRegistrationRepository.find({
        where: { completed: false },
        relations: ["owner"],
      });
      return list;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to fetch",
        serviceErrorCode: "LRS-105",
        httpStatusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async getLitterDetailsById(id: number) {
    try {
      const list = await this.litterRegistrationRepository.findOne({
        where: { id },
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
      return list;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to fetch",
        serviceErrorCode: "LRS-105",
        httpStatusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async approveLitter(id: number, remarks: Array<{ message: string }>) {
    try {
      const update = await this.litterRegistrationRepository.update(
        { id },
        { completed: true, remarks },
      );
      const litterDetails = await this.getLitterDetailsById(id);
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
        }
        if (sirePedigree) {
          animalPedigree.children.push(sirePedigree);
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
      console.log("Failed to approve litter", error);
      throw new ServiceException({
        message: error?.message ?? "Failed to approve litter",
        serviceErrorCode: "LRS",
      });
    }
  }

  async rejectLitter(id: number, remarks: Array<{ message: string }>) {
    try {
      const update = await this.litterRegistrationRepository.update(
        { id },
        { remarks },
      );
      return update.affected;
    } catch (error) {
      console.log("Failed to reject litter", error);
      throw new ServiceException({
        message: error?.message ?? "Failed to reject litter",
        serviceErrorCode: "LRS",
      });
    }
  }
}
