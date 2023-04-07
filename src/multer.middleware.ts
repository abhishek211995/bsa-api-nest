import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as multer from "multer";
import * as multerS3 from "multer-s3";
import * as aws from "@aws-sdk/client-s3";

interface RequestWithUploadImages extends Request {
  uploadImage: (req: Request, res: Response, next: NextFunction) => void;
  uploadDocument: (req: Request, res: Response, next: NextFunction) => void;
  uploadMultipleImages: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
}

@Injectable()
export class MulterService implements NestMiddleware {
  use(req: RequestWithUploadImages, res: Response, next: NextFunction) {
    const imageFilter = (req, file, cb) => {
      if (!file.originalname.match(/\.(JPG|jpg|jpeg|png)$/)) {
        return cb(new Error("Only image files are allowed!"), false);
      }
      cb(null, true);
    };

    const s3Client = new aws.S3Client({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID.trim(),
        secretAccessKey: process.env.SECRET_ACCESS_KEY.trim(),
      },
      region: "ap-south-1",
    });

    const uploadImage = multer({
      fileFilter: imageFilter,
      storage: multerS3({
        s3: s3Client,
        bucket: process.env.BUCKET,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }).single("");

    const uploadDocument = multer({
      storage: multerS3({
        s3: s3Client,
        bucket: process.env.BUCKET,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }).fields([
      { name: "identity_doc", maxCount: 1 },
      { name: "license_doc", maxCount: 1 },
    ]);

    const uploadMultipleImages = multer({
      fileFilter: imageFilter,
      storage: multerS3({
        s3: s3Client,
        bucket: process.env.BUCKET,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          const fileNames = {
            animal_front_view: "front-view",
            animal_left_view: "left-view",
            animal_right_view: "right-view",
            animal_registration_doc: "registration-doc",
          };
          cb(null, fileNames[file.fieldname] + "/" + file.originalname);
        },
      }),
    }).fields([
      { name: "animal_front_view", maxCount: 1 },
      { name: "animal_left_view", maxCount: 1 },
      { name: "animal_right_view", maxCount: 1 },
      { name: "animal_registration_doc", maxCount: 1 },
    ]);

    req.uploadImage = uploadImage;
    req.uploadMultipleImages = uploadMultipleImages;
    req.uploadDocument = uploadDocument;
    console.log("MulterService", req);
    next();
  }
}
