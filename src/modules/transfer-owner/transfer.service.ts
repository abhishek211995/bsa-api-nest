import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServiceException } from "src/exception/base-exception";
import { EmailService } from "src/lib/mail/mail.service";
import { Repository } from "typeorm";
import { AnimalService } from "../animal/animal.service";
import { UsersService } from "../users/users.service";
import { TransferOwnerDto } from "./transfer.dto";
import { BreTransferOwnerRequest } from "./transfer.entity";
import { transferMail } from "src/utils/mailTemplate.util";
@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(BreTransferOwnerRequest)
    private readonly breTransferOwnerRequestRepository: Repository<BreTransferOwnerRequest>,
    private readonly userService: UsersService,
    private readonly animalService: AnimalService,
    private readonly mailService: EmailService,
  ) {}

  async addRequest(transferDto: TransferOwnerDto) {
    try {
      let newTransfer =
        this.breTransferOwnerRequestRepository.create(transferDto);
      newTransfer = await this.breTransferOwnerRequestRepository.save(
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
        const animal = await this.animalService.getAnimalById(
          transferDto.animal_id,
        );
        const link = `localhost:3000/confirmTransfer?transferId=${newTransfer.transfer_id}`;
        const message = transferMail(
          user.user_name,
          animal.animal_name,
          newOwner.user_name,
          link,
        );
        await this.mailService.sendMail(
          user.email,
          "Transfer Request Received",
          message,
        );
      }
      return newTransfer;
    } catch (error) {
      console.log("Failed to add request", JSON.stringify(error));
      throw new ServiceException({
        message: "Failed to add transfer request",
        serviceErrorCode: "TS",
      });
    }
  }

  async getRequestById(id: number) {
    try {
      const transfer = await this.breTransferOwnerRequestRepository.findOne({
        where: { transfer_id: id },
        relations: ["animal_id", "new_owner_id", "old_owner_id"],
      });
      if (!transfer) {
        throw new ServiceException({
          message: "Transfer request not found",
          serviceErrorCode: "TS",
        });
      }
      return transfer;
    } catch (error) {
      console.log("Failed to fetch request", JSON.stringify(error));
      throw new ServiceException({
        message: "Failed to fetch transfer request",
        serviceErrorCode: "TS",
      });
    }
  }

  async approveRequest({ transfer_id, request_rejection_reason }) {
    try {
      const transferDetails = await this.getRequestById(transfer_id);
      const data = await this.breTransferOwnerRequestRepository.update(
        transfer_id,
        {
          request_status: "Approved",
          request_rejection_reason,
        },
      );
      await this.animalService.changeOwner(
        transferDetails.animal_id,
        transferDetails.new_owner_id,
      );
      return data;
    } catch (error) {
      console.log("Failed to approve request", JSON.stringify(error));
      throw new ServiceException({
        message: "Failed to approve transfer request",
        serviceErrorCode: "TS",
      });
    }
  }

  async rejectRequest({ transfer_id, request_rejection_reason }) {
    try {
      const data = await this.breTransferOwnerRequestRepository.update(
        transfer_id,
        {
          request_status: "Reject",
          request_rejection_reason,
        },
      );
      return data;
    } catch (error) {
      console.log("Failed to reject request", JSON.stringify(error));
      throw new ServiceException({
        message: "Failed to reject transfer request",
        serviceErrorCode: "TS",
      });
    }
  }
}
