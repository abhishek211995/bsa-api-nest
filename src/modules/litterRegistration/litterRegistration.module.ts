import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailModule } from "src/lib/mail/mail.module";
import { UsersModule } from "../users/users.module";
import { LitterRegistrationController } from "./litterRegistration.controller";
import { BreLitterRegistration, OtpMapping } from "./litterRegistration.entity";
import { LitterRegistrationService } from "./litterRegistration.service";

@Module({
  controllers: [LitterRegistrationController],
  imports: [
    TypeOrmModule.forFeature([BreLitterRegistration, OtpMapping]),
    UsersModule,
    EmailModule,
  ],
  providers: [LitterRegistrationService],
  exports: [LitterRegistrationService],
})
export class LitterRegistrationModule {}
