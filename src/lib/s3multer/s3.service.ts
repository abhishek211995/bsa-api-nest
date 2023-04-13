import { Injectable } from "@nestjs/common";
import * as multer from "multer";
import * as multerS3 from "multer-s3";
import * as aws from "@aws-sdk/client-s3";

@Injectable()
export class S3Service {
  private s3Client: aws.S3Client;

  constructor() {
    this.s3Client = new aws.S3Client({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID?.trim(),
        secretAccessKey: process.env.SECRET_ACCESS_KEY?.trim(),
      },
      region: "ap-south-1",
    });
  }

  async uploadImage(file: Express.Multer.File) {
    try {
      const uploadResult = await this.s3Client.send(
        new aws.PutObjectCommand({
          Bucket: process.env.BUCKET,
          Key: file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      return uploadResult;
    } catch (error) {
      throw error;
    }
  }

  async uploadDocument(file: Express.Multer.File, user_name: string) {
    try {
      const uploadResult = await this.s3Client.send(
        new aws.PutObjectCommand({
          Bucket: process.env.BUCKET,
          Key: `${user_name}/` + file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      return uploadResult;
    } catch (error) {
      throw error;
    }
  }

  async uploadMultipleImages(files: Express.Multer.File[]) {
    try {
      const EndResult = files.map(async (file) => {
        const uploadResult = await this.s3Client.send(
          new aws.PutObjectCommand({
            Bucket: process.env.BUCKET,
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );
        return uploadResult;
      });
      return Promise.all(EndResult);
    } catch (error) {
      throw error;
    }
  }

  async uploadMultipleDocuments(files: Express.Multer.File[]) {
    try {
      const EndResult = files.map(async (file) => {
        const uploadResult = await this.s3Client.send(
          new aws.PutObjectCommand({
            Bucket: process.env.BUCKET,
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );
        return uploadResult;
      });
      return Promise.all(EndResult);
    } catch (error) {
      throw error;
    }
  }
}
