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

  async uploadSingle(file: Express.Multer.File, folderName?: string) {
    try {
      const path = folderName
        ? `${folderName}/` + file.originalname
        : file.originalname;

      const uploadResult = await this.s3Client.send(
        new aws.PutObjectCommand({
          Bucket: process.env.BUCKET,
          Key: path,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      return uploadResult;
    } catch (error) {
      console.log("upload single error", error);
      throw error;
    }
  }

  async uploadMultiple(files: Express.Multer.File[], folderName?: string) {
    try {
      const EndResult = files.map(async (file) => {
        const path = folderName
          ? `${folderName}/` + file.originalname
          : file.originalname;
        const uploadResult = await this.s3Client.send(
          new aws.PutObjectCommand({
            Bucket: process.env.BUCKET,
            Key: path,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );
        return uploadResult;
      });
      return Promise.all(EndResult);
    } catch (error) {
      console.log("upload multiple error", error);
      throw error;
    }
  }

  async getLink(keys: string) {
    try {
      const command = await new aws.GetObjectCommand({
        Bucket: process.env.BUCKET,
        Key: keys,
      });
      const link = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600 * 2,
      });
      return link;
    } catch (error) {
      console.log("get url error", error);
      throw error;
    }
  }
}
