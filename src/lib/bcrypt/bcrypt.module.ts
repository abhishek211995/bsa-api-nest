import { Module } from "@nestjs/common";
import { Bcrypt } from "./bcrypt.util";

@Module({
  providers: [Bcrypt],
  exports: [Bcrypt],
})
export class BcryptModule {}
