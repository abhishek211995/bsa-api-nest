import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServiceException } from "src/exception/base-exception";
import { Repository } from "typeorm";
import { AnimalBreedDto, EditAnimalBreed } from "./breedMaster.dto";
import { BreAnimalBreedMaster } from "./breedMaster.entity";

@Injectable()
export class AnimalBreedServices {
  constructor(
    @InjectRepository(BreAnimalBreedMaster)
    private readonly breAnimalBreedMasterRepository: Repository<BreAnimalBreedMaster>,
  ) {}

  // Add animal breed
  async addAnimalBreed(animalBreedDto: AnimalBreedDto) {
    const existing = await this.breAnimalBreedMasterRepository.findOne({
      where: {
        animal_breed_name: animalBreedDto.animal_breed_name.trim(),
        animal_type_id: animalBreedDto.animal_type_id,
      },
    });

    if (existing) {
      throw new ServiceException({
        message: "Breed already added",
        serviceErrorCode: "BMS",
      });
    }
    const breed = this.breAnimalBreedMasterRepository.create({
      ...animalBreedDto,
      animal_breed_name: animalBreedDto.animal_breed_name.trim(),
    });
    return this.breAnimalBreedMasterRepository.save(breed);
  }

  // Get animal breed by animal type id
  async getAnimalBreedByAnimalType(animal_type_id: number) {
    try {
      const breed = await this.breAnimalBreedMasterRepository.find({
        where: { animal_type_id: animal_type_id, is_deleted: false },
        relations: { animal_type: true },
      });
      return breed;
    } catch (error) {
      throw new ServiceException({
        message: error.message,
        serviceErrorCode: `BM-${HttpStatus.BAD_REQUEST}`,
        httpStatusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async editAnimalBreed(payload: EditAnimalBreed) {
    try {
      const breed = await this.breAnimalBreedMasterRepository.findOne({
        where: { animal_breed_id: payload.breed_id },
      });

      if (!breed) {
        throw new ServiceException({
          message: "Animal Breed not found",
          httpStatusCode: HttpStatus.BAD_REQUEST,
          serviceErrorCode: `BM-${HttpStatus.BAD_REQUEST}`,
        });
      }

      const result = await this.breAnimalBreedMasterRepository.update(
        {
          animal_breed_id: payload.breed_id,
        },
        {
          animal_breed_description: payload.animal_breed_description,
          animal_breed_name: payload.animal_breed_name,
          animal_type_id: payload.animal_type_id,
        },
      );

      return result;
    } catch (error) {
      throw error instanceof ServiceException
        ? error
        : new ServiceException({
            message: "Internal Server error",
            httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            serviceErrorCode: `BM-${HttpStatus.INTERNAL_SERVER_ERROR}`,
          });
    }
  }

  async deleteAnimalBreedById(id: number) {
    try {
      console.log("iddd", id);

      const res = await this.breAnimalBreedMasterRepository.update(
        { animal_breed_id: id },
        { is_deleted: true },
      );
      console.log("ressss", res);

      return res;
    } catch (error) {
      throw new ServiceException({
        message: "Failed to Delete Animal Breed",
        serviceErrorCode: "AM",
      });
    }
  }
}
