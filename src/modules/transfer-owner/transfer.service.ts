import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServiceException } from "src/exception/base-exception";
import { EmailService } from "src/lib/mail/mail.service";
import { Repository } from "typeorm";
import { AnimalService } from "../animal/animal.service";
import { UsersService } from "../users/users.service";
import { TransferOwnerDto } from "./transfer.dto";
import { BreTransferOwnerRequest } from "./transfer.entity";
import {
  emailContainer,
  transferConfirmation,
  transferMail,
} from "src/utils/mailTemplate.util";
import { BreAnimal } from "../animal/animal.entity";
import { BreUser } from "../users/users.entity";
import { AnimalOwnerHistoryService } from "../animalOwnerHistory/animalOwnerHistory.service";
@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(BreTransferOwnerRequest)
    private readonly breTransferOwnerRequestRepository: Repository<BreTransferOwnerRequest>,
    private readonly userService: UsersService,
    private readonly animalService: AnimalService,
    private readonly mailService: EmailService,
    private readonly animalOwnerHistoryService: AnimalOwnerHistoryService,
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
        const link = `${process.env.WEB_URL}/confirmTransfer?transferId=${newTransfer.transfer_id}&type=animal`;
        const message = emailContainer(
          transferMail(
            user.user_name,
            animal.animal_name,
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
      const transfer = await this.breTransferOwnerRequestRepository.findOne({
        where: { transfer_id: Number(id) },
        relations: ["animal_id", "new_owner_id", "old_owner_id"],
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

      const data = await this.breTransferOwnerRequestRepository.update(
        { transfer_id: Number(transfer_id) },
        {
          request_status: "Approved",
          request_rejection_reason,
        },
      );
      const animal = transferDetails.animal_id as unknown as BreAnimal;
      const newOwner = transferDetails.new_owner_id as unknown as BreUser;
      await this.animalService.changeOwner(animal.animal_id, newOwner.id);
      const animalOwnerHistory =
        await this.animalOwnerHistoryService.createAnimalOwnerHistory({
          animal_id: animal.animal_id,
          owner_id: newOwner.id,
        });

      if (animalOwnerHistory) {
        const message = emailContainer(
          transferConfirmation(
            newOwner.user_name,
            // @ts-expect-error entity types
            transferDetails.old_owner_id.user_name,
            animal.animal_name,
            "accepted",
            "animal",
          ),
          "Transfer Request Approved",
        );
        await this.mailService.sendMail(
          newOwner.email,
          "Transfer Request Approved",
          message,
        );
      }
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
      const data = await this.breTransferOwnerRequestRepository.update(
        { transfer_id: Number(transfer_id) },
        {
          request_status: "Reject",
          request_rejection_reason,
        },
      );

      if (data.affected) {
        const transferDetails = await this.getRequestById(transfer_id);
        const newOwner = transferDetails.new_owner_id as unknown as BreUser;
        const animal = transferDetails.animal_id as unknown as BreAnimal;

        const message = emailContainer(
          transferConfirmation(
            newOwner.user_name,
            // @ts-expect-error entity types
            transferDetails.old_owner_id.user_name,
            animal.animal_name,
            "rejected",
            "animal",
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
