import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreTrasferOwnerRequest } from "./transfer.entity";
import { TransferController } from "./transfer.controller";
import { TransferService } from "./transfer.service";

@Module({
  imports: [TypeOrmModule.forFeature([BreTrasferOwnerRequest])],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
