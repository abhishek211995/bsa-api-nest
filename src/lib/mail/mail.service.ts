import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private readonly transporter;

  constructor() {
    const options: nodemailer.TransportOptions = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true", // set to true if using SSL/TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    } as nodemailer.TransportOptions;

    this.transporter = nodemailer.createTransport(options);
  }

  async sendMail(to: string, subject: string, message: string): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html: message,
    };
    const result = await this.transporter.sendMail(mailOptions);
    console.log("result", result);
    return result;
  }
}
