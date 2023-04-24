import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BreLitterRegistration, OtpMapping } from "./litterRegistration.entity";
import { LitterRegistrationBody } from "./litterRegistration.dto";
import { ServiceException } from "src/exception/base-exception";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { generateOtp } from "src/utils/generateOtp";
import { EmailService } from "src/lib/mail/mail.service";
import { sireOwnerVerificationEmail } from "src/utils/mailTemplate.util";
import { litterSireVerification } from "src/constants/otp.reasons.constant";

@Injectable()
export class LitterRegistrationService {
  constructor(
    @InjectRepository(BreLitterRegistration)
    private readonly litterRegistrationRepository: Repository<BreLitterRegistration>,
    @InjectRepository(OtpMapping)
    private readonly otpRepository: Repository<OtpMapping>,
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
}
