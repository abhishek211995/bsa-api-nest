import { Module } from "@nestjs/common";
import { CCAvenueController } from "./ccavenue.controller";
import { CCAvenueService } from "./ccavenue.service";

@Module({
  imports: [],
  controllers: [CCAvenueController],
  providers: [CCAvenueService],
  exports: [CCAvenueService],
})
export class CcavenueModule {}
