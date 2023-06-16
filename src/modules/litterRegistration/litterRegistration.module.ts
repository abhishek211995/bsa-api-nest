import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailModule } from "src/lib/mail/mail.module";
import { UsersModule } from "../users/users.module";
import { LitterRegistrationController } from "./litterRegistration.controller";
import { BreLitterRegistration, BreLitters } from "./litterRegistration.entity";
import { LitterRegistrationService } from "./litterRegistration.service";
import { AnimalModule } from "../animal/animal.module";
import { BreAnimal } from "../animal/animal.entity";

@Module({
  controllers: [LitterRegistrationController],
  imports: [
    TypeOrmModule.forFeature([BreLitterRegistration, BreAnimal, BreLitters]),
    UsersModule,
    EmailModule,
    AnimalModule,
  ],
  providers: [LitterRegistrationService],
  exports: [LitterRegistrationService],
})
export class LitterRegistrationModule {}
