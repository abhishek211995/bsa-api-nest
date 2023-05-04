import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BreAnimalMaster } from "./animalMaster.entity";
import { AnimalTypeDto, EditAnimalTypePayload } from "./animalMaster.dto";
import { Repository } from "typeorm";
import { ServiceException } from "src/exception/base-exception";

@Injectable()
export class AnimalTypeServices {
  constructor(
    @InjectRepository(BreAnimalMaster)
    private readonly breAnimalMasterRepository: Repository<BreAnimalMaster>,
  ) {}

  // Add animal type
  addAnimalType(animalTypeDto: AnimalTypeDto) {
    const animal = this.breAnimalMasterRepository.create(animalTypeDto);
    return this.breAnimalMasterRepository.save(animal);
  }

  // Get all animal Types
  getAllAnimalTypes() {
    return this.breAnimalMasterRepository.find();
  }

  async editAnimalType(payload: EditAnimalTypePayload) {
    try {
      const animalType = await this.breAnimalMasterRepository.findOne({
        where: { animal_type_id: payload.animal_type_id },
      });
      if (!animalType) {
        throw new ServiceException({
          message: "Animal type not found",
          httpStatusCode: HttpStatus.BAD_REQUEST,
          serviceErrorCode: `AM-${HttpStatus.BAD_REQUEST}`,
        });
      }

      const result = await this.breAnimalMasterRepository.update(
        { animal_type_id: payload.animal_type_id },
        {
          animal_type_name: payload.animal_type_name,
          animal_type_description: payload.animal_type_description,
        },
      );

      return result.affected;
    } catch (error) {
      throw error instanceof ServiceException
        ? error
        : new ServiceException({
            message: "Internal Server error",
            httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            serviceErrorCode: `AM-${HttpStatus.INTERNAL_SERVER_ERROR}`,
          });
    }
  }

  async deleteAnimalType(id: number) {
    try {
      const result = await this.breAnimalMasterRepository.update(
        { animal_type_id: id },
        { is_deleted: true },
      );
      return result;
    } catch (error) {
      throw new ServiceException({
        message: "Failed to delete animal type",
        serviceErrorCode: "AM",
      });
    }
  }
}
