import * as aws from "@aws-sdk/client-s3";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";
import { ServiceException } from "src/exception/base-exception";

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

  async renameFolder(
    oldFolderName: string,
    newFolderName: string,
  ): Promise<boolean> {
    try {
      // List objects in the old folder
      const listObjectsCommand = new ListObjectsCommand({
        Bucket: process.env.BUCKET,
        Prefix: oldFolderName,
      });
      const listObjectsResult = await this.s3Client.send(listObjectsCommand);
      console.log(listObjectsResult);

      // Iterate through the objects and rename them
      const renamePromises = listObjectsResult.Contents?.map(async (object) => {
        const oldKey = object.Key;
        const newKey = oldKey.replace(oldFolderName, newFolderName);

        // Copy the object to the new key
        const copyObjectCommand = new CopyObjectCommand({
          Bucket: process.env.BUCKET,
          CopySource: `${process.env.BUCKET}/${oldKey}`,
          Key: newKey,
        });
        await this.s3Client.send(copyObjectCommand);

        // Delete the original object
        const deleteObjectCommand = new DeleteObjectCommand({
          Bucket: process.env.BUCKET,
          Key: oldKey,
        });
        await this.s3Client.send(deleteObjectCommand);
      });

      // Wait for all rename operations to complete
      await Promise.all(renamePromises);
      return true;
    } catch (error) {
      // Handle any errors that occur during the renaming process
      console.error(
        "An error occurred while renaming the folder:",
        error?.message,
      );
      throw new ServiceException({
        message:
          error?.message ?? "An error occurred while renaming the folder",
        serviceErrorCode: "S3S",
      });
    }
  }
}
