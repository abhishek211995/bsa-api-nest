import { Injectable } from "@nestjs/common";
import * as pkg from "../package.json";

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello World! v${pkg.version}`;
  }
}
