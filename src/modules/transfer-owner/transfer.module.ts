import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreTrasferOwnerRequest } from "./transfer.entity";
import { TransferController } from "./transfer.controller";
import { TransferService } from "./transfer.service";
import { MailModule } from "src/lib/mail/mail.module";
import { UsersModule } from "src/modules/users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([BreTrasferOwnerRequest]),
    MailModule,
    UsersModule,
  ],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
