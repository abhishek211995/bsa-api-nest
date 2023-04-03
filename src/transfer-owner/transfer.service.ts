import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BreTrasferOwnerRequest } from "./transfer.entity";
import { Repository } from "typeorm";
import { transferOwnerDto } from "./transfer.dto";
@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(BreTrasferOwnerRequest)
    private readonly BreTrasferOwnerRequestRepository: Repository<BreTrasferOwnerRequest>,
  ) {}

  addRequest(transferDto: transferOwnerDto) {
    const newTransfer =
      this.BreTrasferOwnerRequestRepository.create(transferDto);
    return this.BreTrasferOwnerRequestRepository.save(newTransfer);
  }

  getRequestById(id: number) {
    const transfer = this.BreTrasferOwnerRequestRepository.findOneBy({
      transfer_id: id,
    });
    return transfer;
  }

  async updateRequest({
    transfer_id,
    request_status,
    request_rejection_reason,
  }) {
    console.log(transfer_id);
    const data = await this.BreTrasferOwnerRequestRepository.update(
      transfer_id,
      {
        request_status,
        request_rejection_reason,
      },
    );
  }
}
