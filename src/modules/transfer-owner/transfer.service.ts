import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServiceException } from "src/exception/base-exception";
import { EmailService } from "src/lib/mail/mail.service";
import { Repository } from "typeorm";
import { AnimalService } from "../animal/animal.service";
import { UsersService } from "../users/users.service";
import { TransferOwnerDto } from "./transfer.dto";
import { BreTransferOwnerRequest } from "./transfer.entity";
import { emailContainer, transferMail } from "src/utils/mailTemplate.util";
import { BreAnimal } from "../animal/animal.entity";
import { BreUser } from "../users/users.entity";
import { decryptNumber, encryptNumber } from "src/utils/encryption";
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
        const encryptId = encryptNumber(newTransfer.transfer_id);
        const link = `${process.env.WEB_URL}/confirmTransfer?transferId=${encryptId}`;
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
      console.log("Failed to add request", JSON.stringify(error));
      throw new ServiceException({
        message: "Failed to add transfer request",
        serviceErrorCode: "TS",
      });
    }
  }

  async getRequestById(id: string, user_id?: number) {
    try {
      const decryptedId = decryptNumber(id);
      const transfer = await this.breTransferOwnerRequestRepository.findOne({
        where: { transfer_id: decryptedId },
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
          serviceErrorCode: "LRS-105",
          httpStatusCode: HttpStatus.BAD_REQUEST,
        });
      }
      return transfer;
    } catch (error) {
      console.log("Failed to fetch request", error?.message);
      throw new ServiceException({
        message: error?.message ?? "Failed to fetch transfer request",
        serviceErrorCode: "TS",
      });
    }
  }

  async approveRequest({ transfer_id, request_rejection_reason }) {
    try {
      const decryptedId = decryptNumber(transfer_id);

      const transferDetails = await this.getRequestById(transfer_id);
      console.log(transferDetails);

      const data = await this.breTransferOwnerRequestRepository.update(
        { transfer_id: decryptedId },
        {
          request_status: "Approved",
          request_rejection_reason,
        },
      );
      const animal = transferDetails.animal_id as unknown as BreAnimal;
      const newOwner = transferDetails.new_owner_id as unknown as BreUser;
      await this.animalService.changeOwner(animal.animal_id, newOwner.id);
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
      const decryptedId = decryptNumber(transfer_id);

      const data = await this.breTransferOwnerRequestRepository.update(
        { transfer_id: decryptedId },
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
