import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ServiceException } from "src/exception/base-exception";
import { Repository } from "typeorm";
import { AnimalBreedDto, EditAnimalBreed } from "./breedMaster.dto";
import { BreAnimalBreedMaster } from "./breedMaster.entity";
import { S3Service } from "src/lib/s3multer/s3.service";
import { fileFilter } from "src/utils/fileFilter.util";

@Injectable()
export class AnimalBreedServices {
  constructor(
    @InjectRepository(BreAnimalBreedMaster)
    private readonly breAnimalBreedMasterRepository: Repository<BreAnimalBreedMaster>,
    private readonly s3Service: S3Service,
  ) {}

  // Add animal breed
  async addAnimalBreed(
    animalBreedDto: AnimalBreedDto,
    files: Array<Express.Multer.File>,
  ) {
    try {
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
      const newBreed = await this.breAnimalBreedMasterRepository.create({
        ...animalBreedDto,
        animal_breed_name: animalBreedDto.animal_breed_name.trim(),
      });

      const breed = await this.breAnimalBreedMasterRepository.save(newBreed);

      if (breed && files.length > 0) {
        const AnimalType = await this.getAnimalBreedByAnimalType(
          animalBreedDto.animal_type_id,
        );

        const animal_breed_image = fileFilter(files, "animal_breed_image")[0];
        const upload = await this.s3Service.uploadSingle(
          animal_breed_image,
          `${(await AnimalType[0])?.animal_type?.animal_type_name}/${
            animalBreedDto.animal_breed_name
          }`,
        );

        const res = await this.breAnimalBreedMasterRepository.update(
          { animal_breed_id: newBreed.animal_breed_id },
          { animal_breed_image: animal_breed_image.originalname },
        );
      }

      return newBreed;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Error while adding animal breed",
        serviceErrorCode: "BMS",
        httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Get animal breed by animal type id
  async getAnimalBreedByAnimalType(animal_type_id: number) {
    try {
      const breed = await this.breAnimalBreedMasterRepository.find({
        where: { animal_type_id: animal_type_id, is_deleted: false },
        relations: { animal_type: true },
      });

      if (!breed) {
        throw new ServiceException({
          message: "Animal Breed not found",
          httpStatusCode: HttpStatus.BAD_REQUEST,
          serviceErrorCode: `BM-${HttpStatus.BAD_REQUEST}`,
        });
      }

      // function which returns the link of the images from s3 service getLink function by mapping the array of breed
      const getLink = async (breed: BreAnimalBreedMaster[]) => {
        const data = breed.map(async (breed) => {
          const link = await this.s3Service.getLink(
            `${breed.animal_type.animal_type_name}/${breed.animal_breed_name}/${breed.animal_breed_image}`,
          );
          return { ...breed, image_link: link };
        });
        return Promise.all(data);
      };

      const result = await getLink(breed);

      return result;
    } catch (error) {
      throw new ServiceException({
        message: error.message,
        serviceErrorCode: `BM-${HttpStatus.BAD_REQUEST}`,
        httpStatusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async editAnimalBreed(
    payload: EditAnimalBreed,
    files: Array<Express.Multer.File>,
  ) {
    console.log("hi");

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
      if (files.length > 0) {
        const AnimalType = await this.getAnimalBreedByAnimalType(
          breed.animal_type_id,
        );
        const animal_breed_image = fileFilter(files, "animal_breed_image")[0];
        const upload = await this.s3Service.uploadSingle(
          animal_breed_image,
          `${(await AnimalType[0])?.animal_type?.animal_type_name}/${
            breed.animal_breed_name
          }`,
        );

        const res = await this.breAnimalBreedMasterRepository.update(
          { animal_breed_id: breed.animal_breed_id },
          { animal_breed_image: animal_breed_image.originalname },
        );
      }
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
      const res = await this.breAnimalBreedMasterRepository.update(
        { animal_breed_id: id },
        { is_deleted: true },
      );

      return res;
    } catch (error) {
      throw new ServiceException({
        message: "Failed to Delete Animal Breed",
        serviceErrorCode: "AM",
      });
    }
  }
}
