import { Controller, Post, Body } from "@nestjs/common";
import { CCAvenueService } from "./ccavenue.service";

@Controller("ccavenue")
export class CCAvenueController {
  constructor(private readonly ccavenueService: CCAvenueService) {}
}
