import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BreAnimalOwnerHistory } from "./animalOwnerHistory.entity";
import { Repository } from "typeorm";
import { AnimalOwnerHistoryDto } from "./animalOwnerHistory.dto";

@Injectable()
export class AnimalOwnerHistoryService {
  constructor(
    @InjectRepository(BreAnimalOwnerHistory)
    private animalOwnerHistoryRepository: Repository<BreAnimalOwnerHistory>,
  ) {}

  async createAnimalOwnerHistory(animalOwnerHistoryDto: AnimalOwnerHistoryDto) {
    try {
      const newAnimalOwnerHistory =
        await this.animalOwnerHistoryRepository.create(animalOwnerHistoryDto);

      const animalOwnerHistory = await this.animalOwnerHistoryRepository.save(
        newAnimalOwnerHistory,
      );
      return animalOwnerHistory;
    } catch (error) {
      throw error;
    }
  }
}
