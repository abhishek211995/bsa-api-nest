import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreCompany } from "./company.entity";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import TransactionUtil from "../../lib/db_utils/transaction.utils";

@Module({
  imports: [TypeOrmModule.forFeature([BreCompany])],
  controllers: [CompanyController],
  providers: [CompanyService, TransactionUtil],
  exports: [CompanyService],
})
export class CompanyModule {}
