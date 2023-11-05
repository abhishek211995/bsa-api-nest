import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailModule } from "src/lib/mail/mail.module";
import { S3Module } from "../../lib/s3multer/s3.module";
import { BreAnimal } from "../animal/animal.entity";
import { AnimalModule } from "../animal/animal.module";
import { UsersModule } from "../users/users.module";
import { LitterRegistrationController } from "./litterRegistration.controller";
import { BreLitterRegistration, BreLitters } from "./litterRegistration.entity";
import { LitterRegistrationService } from "./litterRegistration.service";
import TransactionUtil from "../../lib/db_utils/transaction.utils";

@Module({
  controllers: [LitterRegistrationController],
  imports: [
    TypeOrmModule.forFeature([BreLitterRegistration, BreAnimal, BreLitters]),
    UsersModule,
    EmailModule,
    AnimalModule,
    S3Module,
  ],
  providers: [LitterRegistrationService, TransactionUtil],
  exports: [LitterRegistrationService],
})
export class LitterRegistrationModule {}
