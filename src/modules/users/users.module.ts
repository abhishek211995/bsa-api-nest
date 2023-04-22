import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BcryptModule } from "src/lib/bcrypt/bcrypt.module";
import { BreederModule } from "src/modules/breeder/breeder.module";
import { UsersController } from "./users.controller";
import { BreUser } from "./users.entity";
import { UsersService } from "./users.service";
import { S3Module } from "src/lib/s3multer/s3.module";
import { BreederFarm } from "../breederFarm/breederFarm.module";
import { EmailModule } from "src/lib/mail/mail.module";
@Module({
  imports: [
    TypeOrmModule.forFeature([BreUser]),
    BreederModule,
    BcryptModule,
    S3Module,
    BreederFarm,
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
