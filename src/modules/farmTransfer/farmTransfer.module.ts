import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailModule } from "src/lib/mail/mail.module";
import { BreederModule } from "src/modules/breeder/breeder.module";
import { BreederFarmModule } from "src/modules/breederFarm/breederFarm.module";
import { TransferFarmController } from "src/modules/farmTransfer/farmTransfer.controller";
import { BreTransferFarmRequest } from "src/modules/farmTransfer/farmTransfer.entity";
import { TransferFarmService } from "src/modules/farmTransfer/farmTransfer.service";
import { UsersModule } from "src/modules/users/users.module";
@Module({
  imports: [
    TypeOrmModule.forFeature([BreTransferFarmRequest]),
    UsersModule,
    EmailModule,
    BreederFarmModule,
    BreederModule,
  ],
  controllers: [TransferFarmController],
  providers: [TransferFarmService],
})
export class TransferFarmModule {}
