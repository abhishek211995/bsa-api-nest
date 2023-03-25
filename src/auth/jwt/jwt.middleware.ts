import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { UsersService } from "../../users/users.service";
dotenv.config();

@Injectable()
export class JWTMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      const user = this.usersService.getUserById(decoded["id"]);
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
      }

      req.body.user = user;
      next();
    }
  }
}
