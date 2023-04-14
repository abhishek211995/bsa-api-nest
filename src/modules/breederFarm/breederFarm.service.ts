import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BreBreederFarm } from "./breederFarm.entity";
import { Repository } from "typeorm";
import { BreederFarmDto } from "./breederFarm.dto";

@Injectable()
export class breederFarmService {
  constructor(
    @InjectRepository(BreBreederFarm)
    private breederFarmRepository: Repository<BreBreederFarm>,
  ) {}

  async createBreederFarm(breederFarmDto: BreederFarmDto) {
    try {
      breederFarmDto.farm_id.split(",").forEach(async (farm_id) => {
        const newBreederFarm = await this.breederFarmRepository.create({
          farm_id: Number(farm_id),
          breeder_id: breederFarmDto.breeder_id,
        });
        const newFarms = await this.breederFarmRepository.save(newBreederFarm);
        console.log(newBreederFarm);
        setTimeout(() => {}, 3000);
      });
    } catch (error) {
      throw error;
    }
  }
}
