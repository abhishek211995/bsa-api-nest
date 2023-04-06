import { Module } from "@nestjs/common";
import { Global } from "@nestjs/common/decorators";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreederController } from "./breeder.controller";
import { BreBreeder } from "./breeder.entity";
import { BreederService } from "./breeder.service";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([BreBreeder])],
  controllers: [BreederController],
  providers: [BreederService],
  exports: [BreederService],
})
export class BreederModule {}
