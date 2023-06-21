import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BreAnimalOwnerHistory } from "./animalOwnerHistory.entity";
import { Repository } from "typeorm";
import { AnimalOwnerHistoryDto } from "./animalOwnerHistory.dto";
import { ServiceException } from "src/exception/base-exception";

@Injectable()
export class AnimalOwnerHistoryService {
  constructor(
    @InjectRepository(BreAnimalOwnerHistory)
    private animalOwnerHistoryRepository: Repository<BreAnimalOwnerHistory>,
  ) {}

  async createAnimalOwnerHistory(animalOwnerHistoryDto: AnimalOwnerHistoryDto) {
    try {
      const animalOwnerHistory = await this.getAnimalOwnerHistoryByAnimalId(
        animalOwnerHistoryDto.animal_id,
      );
      if (animalOwnerHistory.length > 0) {
        animalOwnerHistory.forEach(async (element) => {
          await this.animalOwnerHistoryRepository.update(
            {
              id: element.id,
            },
            {
              is_current_owner: false,
            },
          );
        });
      }

      const newAnimalOwnerHistory =
        await this.animalOwnerHistoryRepository.create({
          ...animalOwnerHistoryDto,
          is_current_owner: true,
        });

      const OwnerHistory = await this.animalOwnerHistoryRepository.save(
        newAnimalOwnerHistory,
      );
      return OwnerHistory;
    } catch (error) {
      throw error;
    }
  }

  async getAnimalOwnerHistoryByAnimalId(animal_id: string) {
    try {
      const animalOwnerHistory = await this.animalOwnerHistoryRepository.find({
        where: { animal_id: animal_id },
      });
      return animalOwnerHistory;
    } catch (error) {
      throw error;
    }
  }

  async getAnimalCurrentOwner(animal_id: string) {
    try {
      const animalOwner = await this.animalOwnerHistoryRepository.findOne({
        where: { animal_id: animal_id, is_current_owner: true },
        relations: ["owner"],
      });

      return animalOwner;
    } catch (error) {
      throw error;
    }
  }

  async getAllOwners() {
    try {
      const owners = await this.animalOwnerHistoryRepository.find({
        where: {
          is_current_owner: true,
        },
        relations: ["owner"],
      });
      return owners;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Error in fetching owners",
        serviceErrorCode: "AOHS",
      });
    }
  }
}
