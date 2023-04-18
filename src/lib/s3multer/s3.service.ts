import * as aws from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";

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

  async uploadMultipleImages(
    files: Express.Multer.File[],
    register_no: string,
  ) {
    try {
      console.log("register_no: ", register_no);

      const EndResult = files.map(async (file) => {
        const uploadResult = await this.s3Client.send(
          new aws.PutObjectCommand({
            Bucket: process.env.BUCKET,
            Key: `${register_no}/` + file.originalname,
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

  async getLink(keys: string) {
    try {
      const command = new aws.GetObjectCommand({
        Bucket: process.env.BUCKET,
        Key: keys,
      });
      // const result = await this.s3Client.send(command);
      return getSignedUrl(this.s3Client, command, { expiresIn: 3600 * 2 });
      // return result;
    } catch (error) {
      throw error;
    }
  }
}
