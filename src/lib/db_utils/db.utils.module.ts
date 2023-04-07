import { Module } from "@nestjs/common";
import TransactionUtil from "src/lib/db_utils/transaction.utils";

@Module({
  providers: [TransactionUtil],
  exports: [TransactionUtil],
})
export class DBUtilsModule {}
