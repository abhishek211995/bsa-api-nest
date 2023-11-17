import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServiceException } from "src/exception/base-exception";
import { EmailService } from "src/lib/mail/mail.service";
import { BreederFarmService } from "src/modules/breederFarm/breederFarm.service";
import { TransferFarmDto } from "src/modules/farmTransfer/farmTransfer.dto";
import { BreTransferFarmRequest } from "src/modules/farmTransfer/farmTransfer.entity";
import {
  emailContainer,
  transferConfirmation,
  transferFarmConfirmation,
  transferFarmMail,
} from "src/utils/mailTemplate.util";
import { Repository } from "typeorm";
import { BreUser } from "../users/users.entity";
import { UsersService } from "../users/users.service";
@Injectable()
export class TransferFarmService {
  constructor(
    @InjectRepository(BreTransferFarmRequest)
    private readonly breTransferFarmRequestRepository: Repository<BreTransferFarmRequest>,
    private readonly userService: UsersService,
    private readonly breederFarmService: BreederFarmService,
    private readonly mailService: EmailService,
  ) {}

  async addRequest(transferDto: TransferFarmDto) {
    try {
      let newTransfer =
        this.breTransferFarmRequestRepository.create(transferDto);
      newTransfer = await this.breTransferFarmRequestRepository.save(
        transferDto,
      );
      if (newTransfer) {
        // get email of user by id
        const user = await this.userService.getUserById(
          transferDto.old_owner_id,
        );
        const newOwner = await this.userService.getUserById(
          transferDto.new_owner_id,
        );
        const farm = await this.breederFarmService.getBreederFarmById(
          transferDto.farm_id,
        );
        const link = `${process.env.WEB_URL}/confirmTransfer?transferId=${newTransfer.transfer_id}&type=farm`;
        const message = emailContainer(
          transferFarmMail(
            user.user_name,
            farm.farm_name,
            newOwner.user_name,
            link,
          ),
          "Transfer Request Received",
        );
        await this.mailService.sendMail(
          user.email,
          "Transfer Request Received",
          message,
        );
      }
      return newTransfer;
    } catch (error) {
      throw new ServiceException({
        message: "Failed to add transfer request",
        serviceErrorCode: "TS",
      });
    }
  }

  async getRequestById(id: string, user_id?: number) {
    try {
      const transfer = await this.breTransferFarmRequestRepository.findOne({
        where: { transfer_id: Number(id) },
        relations: ["farm_id", "new_owner_id", "old_owner_id"],
      });
      if (!transfer) {
        throw new ServiceException({
          message: "Transfer request not found",
          serviceErrorCode: "TS",
        });
      }
      // @ts-expect-error entity types
      if (user_id && transfer.old_owner_id.id !== user_id) {
        throw new ServiceException({
          message: "You are not authorized to view this transfer request",
          serviceErrorCode: "TS-400",
          httpStatusCode: 400,
        });
      }
      return transfer;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to fetch transfer request",
        httpStatusCode:
          error?.httpStatusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
        serviceErrorCode: "TS",
      });
    }
  }

  async approveRequest({ transfer_id, request_rejection_reason }) {
    try {
      const transferDetails = await this.getRequestById(transfer_id);

      const data = await this.breTransferFarmRequestRepository.update(
        { transfer_id: Number(transfer_id) },
        {
          request_status: "Approved",
          request_rejection_reason,
        },
      );
      const farm = transferDetails.farm;
      const newOwner = transferDetails.new_owner_id as unknown as BreUser;

      const message = emailContainer(
        transferFarmConfirmation(
          newOwner.user_name,
          // @ts-expect-error entity types
          transferDetails.old_owner_id.user_name,
          farm.farm_name,
          "accepted",
        ),
        "Transfer Request Approved",
      );
      await this.mailService.sendMail(
        newOwner.email,
        "Transfer Request Approved",
        message,
      );
      return data;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to approve transfer request",
        serviceErrorCode: "TS",
      });
    }
  }

  async rejectRequest({ transfer_id, request_rejection_reason }) {
    try {
      const data = await this.breTransferFarmRequestRepository.update(
        { transfer_id: Number(transfer_id) },
        {
          request_status: "Reject",
          request_rejection_reason,
        },
      );

      if (data.affected) {
        const transferDetails = await this.getRequestById(transfer_id);
        const newOwner = transferDetails.new_owner_id as unknown as BreUser;
        const farm = transferDetails.farm;

        const message = emailContainer(
          transferConfirmation(
            newOwner.user_name,
            // @ts-expect-error entity types
            transferDetails.old_owner_id.user_name,
            farm.farm_name,
            "rejected",
          ),
          "Transfer Request Rejected",
        );
        await this.mailService.sendMail(
          newOwner.email,
          "Transfer Request Rejected",
          message,
        );
      }
      return data;
    } catch (error) {
      throw new ServiceException({
        message: "Failed to reject transfer request",
        serviceErrorCode: "TS",
      });
    }
  }
}
