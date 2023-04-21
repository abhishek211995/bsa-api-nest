import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BreLitterRegistration } from "./litterRegistration.entity";
import { LitterRegistrationBody } from "./litterRegistration.dto";
import { ServiceException } from "src/exception/base-exception";
import { Repository } from "typeorm";

@Injectable()
export class LitterRegistrationService {
  constructor(
    @InjectRepository(BreLitterRegistration)
    private readonly litterRegistrationRepository: Repository<BreLitterRegistration>,
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
            message: "Failed to add litter",
            serviceErrorCode: "LRS-100",
          });
    }
  }
}
