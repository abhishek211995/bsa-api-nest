import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BreederDto } from "./breeder.dto";
import { BreBreeder } from "./breeder.entity";

@Injectable()
export class BreederService {
  constructor(
    @InjectRepository(BreBreeder)
    private readonly breederRepository: Repository<BreBreeder>,
  ) {}

  async createBreeder(breederDto: BreederDto, user_id: number) {
    try {
      const newBreeder = this.breederRepository.create({
        ...breederDto,
        user_id,
        breeder_license_expiry_date: new Date(
          breederDto.breeder_license_expiry_date,
        ),
      });
      return await this.breederRepository.save(newBreeder);
    } catch (err) {
      console.log(err);
    }
  }
  async getBreeder(user_id: any) {
    try {
      const breeder = await this.breederRepository.findOne({
        where: { user_id: user_id },
        relations: ["user"],
      });

      return breeder;
    } catch (err) {
      return err;
    }
  }
}
