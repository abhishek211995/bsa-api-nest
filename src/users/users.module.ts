import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreederModule } from "src/breeder/breeder.module";
import { UsersController } from "./users.controller";
import { BreUser } from "./users.entity";
import { Bcrypt, UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([BreUser]), BreederModule],
  controllers: [UsersController],
  providers: [UsersService, Bcrypt],
  exports: [UsersService],
})
export class UsersModule {}
