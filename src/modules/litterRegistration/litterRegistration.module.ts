import { Module } from "@nestjs/common";
import { LitterRegistrationController } from "./litterRegistration.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreLitterRegistration } from "./litterRegistration.entity";
import { LitterRegistrationService } from "./litterRegistration.service";

@Module({
  controllers: [LitterRegistrationController],
  imports: [TypeOrmModule.forFeature([BreLitterRegistration])],
  providers: [LitterRegistrationService],
  exports: [LitterRegistrationService],
})
export class LitterRegistrationModule {}
