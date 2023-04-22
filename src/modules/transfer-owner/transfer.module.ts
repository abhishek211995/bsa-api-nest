import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/modules/users/users.module";
import { TransferController } from "./transfer.controller";
import { BreTrasferOwnerRequest } from "./transfer.entity";
import { TransferService } from "./transfer.service";
import { EmailModule } from "src/lib/mail/mail.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([BreTrasferOwnerRequest]),
    UsersModule,
    EmailModule,
  ],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
