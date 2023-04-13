import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BcryptModule } from "src/lib/bcrypt/bcrypt.module";
import { BreederModule } from "src/modules/breeder/breeder.module";
import { UsersController } from "./users.controller";
import { BreUser } from "./users.entity";
import { UsersService } from "./users.service";
import { S3Module } from "src/lib/s3multer/s3.module";
import { BreederFarmModule } from "../breederFarm/breederFarm.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([BreUser]),
    BreederModule,
    BcryptModule,
    S3Module,
    BreederFarmModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
