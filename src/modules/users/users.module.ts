import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BcryptModule } from "src/lib/bcrypt/bcrypt.module";
import { EmailModule } from "src/lib/mail/mail.module";
import { S3Module } from "src/lib/s3multer/s3.module";
import { BreRoleMaster } from "src/master/master.entity";
import { BreederModule } from "src/modules/breeder/breeder.module";
import { UsersController } from "./users.controller";
import { BreUser } from "./users.entity";
import { UsersService } from "./users.service";
import { SubscriptionModule } from "../subscription/subscription.module";
@Module({
  imports: [
    TypeOrmModule.forFeature([BreUser, BreRoleMaster]),
    BreederModule,
    BcryptModule,
    S3Module,
    EmailModule,
    SubscriptionModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
