import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { ServiceException } from "../../exception/base-exception";
import { BreUserCourses } from "./user-course.entity";
import { CCAvenueService } from "../ccavenue/ccavenue.service";
import { getFiveDigitId } from "../../utils/generateReg.util";
import { PaymentStatus } from "../orders/orders.entity";
import {
  CCAvenueResponse,
  CompleteCCAvenueOrderDto,
} from "../orders/orders.dto";

@Injectable()
export class UserCourseService {
  constructor(
    @InjectRepository(BreUserCourses)
    private readonly userCoursesRepository: Repository<BreUserCourses>,
    private readonly ccAvenueService: CCAvenueService,
  ) {}

  async getUserCourses(user_id?: string, id?: string) {
    try {
      const options: FindManyOptions<BreUserCourses> = {};

      if (user_id) {
        options.where = { user_id: Number(user_id) };
      }
      if (id) {
        options.where = { id: Number(id) };
      }
      options.relations = ["course"];
      const list = await this.userCoursesRepository.find(options);
      return list;
    } catch (error) {
      console.log("error while fetching subscribed courses");
      throw new ServiceException({
        message: error?.message ?? "Error while fetching subscribed courses",
        serviceErrorCode: "UCS-500",
        httpStatusCode: 400,
      });
    }
  }

  async buyCourse(
    userId: number,
    courseId: number,
    amount: number,
    userName: string,
    description: string,
    billingAddress: string,
  ) {
    try {
      const educationCount = await this.userCoursesRepository.count();
      const rec = `GBA-EDU-${userId}-${getFiveDigitId(educationCount + 1)}`;
      const entry = {
        user_id: userId,
        course_id: courseId,
        receipt: rec,
        payment_status: PaymentStatus.Initiated,
        order_id: `EDU-${educationCount + 1}`,
      };
      let userCourseEntry = this.userCoursesRepository.create(entry);
      userCourseEntry = await this.userCoursesRepository.save(entry);
      const orderLink = this.ccAvenueService.generatePaymentRequest(
        amount,
        entry.order_id,
        userName,
        billingAddress,
        description,
        "userCourse/completeBuy",
      );
      return { orderLink, userCourseEntry };
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Error while initiating buy course",
        serviceErrorCode: "UCS-500",
        httpStatusCode: 400,
      });
    }
  }

  async completePayment(body: CompleteCCAvenueOrderDto) {
    try {
      const output: CCAvenueResponse =
        await this.ccAvenueService.verifyPaymentResponse(body);
      const orderId = output.order_id;
      const paymentStatus = output.order_status;
      // Perform additional logic based on the payment status
      if (paymentStatus === "Success") {
        console.log("marking order as success");
        await this.userCoursesRepository.update(
          { order_id: orderId },
          {
            payment_method: output.payment_mode,
            payment_status: PaymentStatus.Success,
          },
        );
      } else if (paymentStatus === "Failure") {
        console.log("marking order as failed");

        await this.userCoursesRepository.update(
          { order_id: orderId },
          {
            payment_method: output.payment_mode,
            payment_status: PaymentStatus.Failed,
            payment_failure_reason: output.failure_message,
          },
        );
      } else {
        // for Aborted and Invalid
        console.log("marking order as failed for aborted and invalid");

        await this.userCoursesRepository.update(
          { order_id: orderId },
          {
            payment_method: output.payment_mode,
            payment_status: PaymentStatus.Failed,
            payment_failure_reason: output.failure_message,
          },
        );
      }

      return `${process.env.WEB_URL}/payment?order_id=${orderId}&status=${paymentStatus}&refNo=${output.bank_ref_no}&mode=${output.payment_mode}&description=${output.merchant_param1}&module=education`;
    } catch (error) {
      console.log("error", error);
      throw new ServiceException({
        message: "Failed to Complete order",
        serviceErrorCode: "UCS",
      });
    }
  }

  async completeCourseForUser(id: string) {
    try {
      const update = await this.userCoursesRepository.update(
        { id: Number(id) },
        { completed: true },
      );
      if (update.affected < 1) {
        throw new ServiceException({
          message: "Failed to Complete course",
          serviceErrorCode: "UCS",
        });
      }
      return update;
    } catch (error) {
      throw new ServiceException({
        message: "Failed to Complete course",
        serviceErrorCode: "UCS",
      });
    }
  }
}
