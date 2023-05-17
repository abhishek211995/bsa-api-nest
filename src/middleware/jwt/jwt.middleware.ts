import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { UsersService } from "../../modules/users/users.service";
dotenv.config();

@Injectable()
export class JWTMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log(req.headers);

    const token = req.headers["authorization"]?.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      const user = await this.usersService.getUserById(decoded["user_id"]);
      if (!user) {
        res.status(401).json({ message: "User does not exist" });
      }
      req.body.user = user;
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  }
}
