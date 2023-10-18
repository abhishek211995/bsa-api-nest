import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ServiceException } from "../../exception/base-exception";
import { S3Service } from "../../lib/s3multer/s3.service";
import { fileFilter } from "../../utils/fileFilter.util";
import { NewCourseDto } from "./courses.dto";
import { BreCourses } from "./courses.entity";

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(BreCourses)
    private readonly coursesRepository: Repository<BreCourses>,
    private readonly s3Service: S3Service,
  ) {}

  async createCourse(
    courseData: NewCourseDto,
    files: Array<Express.Multer.File>,
  ) {
    try {
      const coverImage = fileFilter(files, "image")[0];
      await this.s3Service.uploadSingle(coverImage, `courses`);
      const course = this.coursesRepository.create({
        fees: courseData.fees,
        end_date: new Date(courseData.end_date),
        image: coverImage.originalname,
        name: courseData.name,
        start_date: new Date(courseData.start_date),
        syllabus: courseData.syllabus,
      });
      const newCourse = await this.coursesRepository.save(course);
      return newCourse;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Error while creating course",
        serviceErrorCode: "CS-500",
        httpStatusCode: 400,
      });
    }
  }

  async getCourses(startDate?: string, endDate?: string, is_active?: string) {
    try {
      const queryBuilder = this.coursesRepository.createQueryBuilder("c");
      if (startDate) {
        queryBuilder.where("c.start_date >= :startDate", { startDate });
      }
      if (endDate) {
        queryBuilder.where("c.end_date <= :endDate", { endDate });
      }
      if (is_active) {
        queryBuilder.where("c.is_active = :is_active", {
          is_active: Boolean(is_active),
        });
      }
      let courses = await queryBuilder.getMany();
      courses = await Promise.all(
        courses.map(async (c) => {
          const image = await this.s3Service.getLink(`courses/${c.image}`);
          return {
            ...c,
            image,
          };
        }),
      );
      return courses;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Error while fetching course",
        serviceErrorCode: "CS-500",
        httpStatusCode: 400,
      });
    }
  }

  async getSingleCourse(id: string) {
    try {
      let course = await this.coursesRepository.findOne({
        where: { id: Number(id) },
      });
      const image = await this.s3Service.getLink(`courses/${course.image}`);
      course = { ...course, image };
      return course;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Error while fetching single course",
        serviceErrorCode: "CS-500",
        httpStatusCode: 400,
      });
    }
  }

  async updateCourse(
    id: string,
    body: NewCourseDto,
    files: Array<Express.Multer.File>,
  ) {
    try {
      const course = await this.coursesRepository.findOne({
        where: { id: Number(id) },
      });

      if (!course) {
        throw new ServiceException({
          message: "Course not found",
          serviceErrorCode: "CS-404",
          httpStatusCode: 404,
        });
      }
      let image = course.image;
      if (files?.length > 0) {
        const coverImage = fileFilter(files, "image")[0];
        await this.s3Service.uploadSingle(coverImage, `courses`);
        image = coverImage.originalname;
      }
      const update = await this.coursesRepository.update(
        { id: Number(id) },
        { ...body, image },
      );

      return update;
    } catch (error) {
      console.log("error while updating course", error);
      throw new ServiceException({
        message: error?.message ?? "Error while updating single course",
        serviceErrorCode: "CS-500",
        httpStatusCode: 400,
      });
    }
  }
}
