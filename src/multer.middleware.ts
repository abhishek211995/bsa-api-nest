import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as multer from "multer";
import * as multerS3 from "multer-s3";
import * as aws from "@aws-sdk/client-s3";

@Injectable()
export class MulterService implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const imageFilter = (req, file, cb) => {
      if (!file.originalname.match(/\.(JPG|jpg|jpeg|png)$/)) {
        return cb(new Error("Only image files are allowed!"), false);
      }
      cb(null, true);
    };
    const uploadImages = multer({
      // fileFilter: imageFilter,
      // storage: multerS3({
      //   s3: new aws.S3Client({
      //     credentials: {
      //       accessKeyId: process.env.ACCESS_KEY_ID.trim(),
      //       secretAccessKey: process.env.SECRET_ACCESS_KEY.trim(),
      //     },
      //     region: "ap-south-1",
      //   }),
      //   bucket: process.env.BUCKET,
      //   metadata: function (req, file, cb) {
      //     cb(null, { fieldName: file.fieldname });
      //   },
      //   key: function (req, file, cb) {
      //     cb(null, file.originalname);
      //   },
      // }),
    }).single("file");

    const uploadDocument = multer({
      // storage: multerS3({
      //   s3: new aws.S3Client({
      //     credentials: {
      //       accessKeyId: process.env.ACCESS_KEY_ID.trim(),
      //       secretAccessKey: process.env.SECRET_ACCESS_KEY.trim(),
      //     },
      //     region: "ap-south-1",
      //   }),
      //   bucket: process.env.BUCKET,
      //   metadata: function (req, file, cb) {
      //     cb(null, { fieldName: file.fieldname });
      //   },
      //   key: function (req, file, cb) {
      //     cb(null, file.originalname);
      //   },
      // }),
    }).fields([
      { name: "identity_doc", maxCount: 1 },
      { name: "license_doc", maxCount: 1 },
    ]);

    next();
  }
}
