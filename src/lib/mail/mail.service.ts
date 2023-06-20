import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import path from "path";

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
    const mailOptions: MailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html: message,
      attachments: [
        {
          filename: "latest_logo.png",
          cid: "logo",
          path: path.join(__dirname, "../../../assets/images/latest_logo.png"),
        },
      ],
    };
    // console.log(mailOptions, "mailOptions");

    const result = await this.transporter.sendMail(mailOptions);
    console.log("result", result);
    return result;
  }
}
