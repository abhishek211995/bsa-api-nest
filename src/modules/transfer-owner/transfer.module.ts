import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailModule } from "src/lib/mail/mail.module";
import { UsersModule } from "src/modules/users/users.module";
import { AnimalModule } from "../animal/animal.module";
import { TransferController } from "./transfer.controller";
import { BreTransferOwnerRequest } from "./transfer.entity";
import { TransferService } from "./transfer.service";
import { AnimalOwnerHistoryModule } from "../animalOwnerHistory/animalOwnerHistory.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([BreTransferOwnerRequest]),
    UsersModule,
    EmailModule,
    AnimalModule,
    AnimalOwnerHistoryModule,
  ],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
