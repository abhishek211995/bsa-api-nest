import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreederService } from "src/breeder/breeder.service";
import { UsersController } from "./users.controller";
import { BreUser } from "./users.entity";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([BreUser]), BreederService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
