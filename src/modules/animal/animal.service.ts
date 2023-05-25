import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InsertResult, QueryRunner, Raw, Repository } from "typeorm";
import {
  AnimalDto,
  AnimalWithPedigreePayload,
  ChangeNamePayload,
  CreateAnimalDto,
  CreateGenerationsDto,
} from "./animal.dto";
import { BreAnimal } from "./animal.entity";
import TransactionUtil from "src/lib/db_utils/transaction.utils";
import { generateRegNo } from "src/utils/generateReg.util";
import { S3Service } from "src/lib/s3multer/s3.service";
import { fileFilter } from "src/utils/fileFilter.util";
import { ServiceException } from "src/exception/base-exception";
import { animalRegistrationSource } from "src/constants/animal_registration.constant";
import { BreederService } from "../breeder/breeder.service";

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(BreAnimal)
    private readonly animalRepository: Repository<BreAnimal>,
    private transactionUtils: TransactionUtil,
    private readonly s3Service: S3Service,
    private readonly breederService: BreederService,
  ) {}

  // single animal
  async createAnimal(animalDto: AnimalDto, files: Array<Express.Multer.File>) {
    const animalCount = await this.animalRepository.count();
    animalDto.animal_registration_number = generateRegNo(
      animalDto.animal_breed_id,
      animalCount + 1,
    );
    const AnimalData = await this.animalRepository.create({
      ...animalDto,
      registration_source: animalRegistrationSource.registration,
    });
    const animal = await this.animalRepository.save(AnimalData);
    if (animal) {
      const uploadData = await this.s3Service.uploadMultiple(
        files,
        animal.animal_registration_number,
      );
      const animal_front = fileFilter(files, "animal_front_view_image")[0]
        .originalname;
      const animal_left = fileFilter(files, "animal_left_view_image")[0]
        .originalname;
      const animal_right = fileFilter(files, "animal_right_view_image")[0]
        .originalname;
      if (uploadData) {
        await this.animalRepository.update(
          { animal_id: animal.animal_id },
          {
            animal_front_view_image: animal_front,
            animal_left_view_image: animal_left,
            animal_right_view_image: animal_right,
          },
        );
        const dna_doc = fileFilter(files, "animal_dna_doc");
        if (dna_doc.length > 0) {
          await this.animalRepository.update(
            { animal_id: animal.animal_id },
            {
              animal_dna_doc: dna_doc[0].originalname,
            },
          );
        }
        const hded_doc = fileFilter(files, "animal_hded_doc");
        if (hded_doc.length > 0) {
          await this.animalRepository.update(
            { animal_id: animal.animal_id },
            {
              animal_hded_doc: hded_doc[0].originalname,
            },
          );
        }
      }
      return { animal, uploadData };
    }
  }

  // get all animals of user by animal type id and gender
  async getAllAnimalByAnimalType({
    animal_owner_id,
    animal_type_id,
    gender,
  }: {
    animal_owner_id: number;
    animal_type_id: number;
    gender: string;
  }) {
    try {
      const findWhereOptions: Record<string, any> = {};
      if (animal_owner_id) {
        findWhereOptions.animal_owner_id = Number(animal_owner_id);
      }
      if (animal_type_id) {
        findWhereOptions.animal_type_id = Number(animal_type_id);
      }
      if (gender) {
        findWhereOptions.animal_gender = gender;
      }

      let data = await this.animalRepository.find({
        where: findWhereOptions,
        relations: ["animal_breed_id", "animal_type_id", "animal_owner_id"],
      });

      if (animal_owner_id) {
        data = data.filter((item) => {
          return (
            // @ts-expect-error entity type issue
            item.animal_owner_id.id == animal_owner_id
          );
        });
      }

      if (animal_type_id) {
        data = data.filter((item) => {
          return (
            // @ts-expect-error entity type issue
            item.animal_type_id.animal_type_id == animal_type_id
          );
        });
      }

      return data;
    } catch (error) {
      console.log("error while fetching animal", error);
      throw new ServiceException({
        message: "Failed to fetch",
        serviceErrorCode: "AS-101",
      });
    }
  }

  // get animal and owner details by animal microchip id or registration id
  getAnimalAndOwner({ animal_microchip_id }: { animal_microchip_id: string }) {
    try {
      const data = this.animalRepository.findOne({
        where: {
          animal_microchip_id,
        },
        relations: ["animal_owner_id"],
      });
      return data;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to fetch animal and owner details",
        serviceErrorCode: "AS-101",
      });
    }
  }

  async createAnimalWithPedigree(
    payload: AnimalWithPedigreePayload,
    files: Array<Express.Multer.File>,
  ) {
    try {
      const animalData = JSON.parse(payload.animalData);
      const generations = JSON.parse(payload.generations);
      const { animalTypeId, breedId } = payload;
      let animalsCount = await this.animalRepository.count();
      const animalDataDto = new CreateAnimalDto(
        animalData.id,
        animalData.name,
        animalTypeId,
        breedId,
        animalData.gender,
        payload.userId,
        animalData.sireId,
        animalData.damId,
        animalData.pedigree,
        generateRegNo(breedId, animalsCount + 1),
        animalData.colorMarking,
        new Date(animalData.dob),
        animalData.microchip,
        "",
        animalRegistrationSource.registration,
      );

      const mainAnimalResult = await this.transactionUtils.executeInTransaction(
        this.upsertAnimal([animalDataDto]),
      );
      const uploadData = await this.s3Service.uploadMultiple(
        files,
        animalDataDto.animal_registration_number,
      );
      if (uploadData) {
        await this.animalRepository.update(
          { animal_id: animalDataDto.animal_id },
          {
            animal_registration_doc: fileFilter(files, "certificate")[0]
              .originalname,
          },
        );
        const dna_doc = fileFilter(files, "dnaDoc");

        if (dna_doc.length > 0) {
          await this.animalRepository.update(
            { animal_id: animalDataDto.animal_id },
            {
              animal_dna_doc: dna_doc[0].originalname,
            },
          );
        }
        const hded_doc = fileFilter(files, "hdedDoc");
        if (hded_doc.length > 0) {
          await this.animalRepository.update(
            { animal_id: animalDataDto.animal_id },
            {
              animal_hded_doc: hded_doc[0].originalname,
            },
          );
        }
      }

      animalsCount++;

      const genData = generations.map((g, i) => {
        const reg_no = generateRegNo(breedId, animalsCount + 1 + i);
        return new CreateGenerationsDto(
          g.id,
          g.name,
          animalTypeId,
          breedId,
          g.gender,
          payload.userId,
          g.sireId,
          g.damId,
          g.pedigree,
          reg_no,
        );
      });
      const result = await this.transactionUtils.executeInTransaction(
        this.upsertGenerations(genData),
      );

      return { mainAnimalResult, result };
    } catch (error) {
      console.log("error", error);
      throw new ServiceException({
        message: error?.message ?? "Failed to add animals",
        serviceErrorCode: "AS-100",
      });
    }
  }

  upsertGenerations(generations: CreateGenerationsDto[]) {
    try {
      return async function (queryRunner: QueryRunner): Promise<InsertResult> {
        const upsertResult = await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(BreAnimal)
          .values(generations)
          .execute();

        return upsertResult;
      };
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  upsertAnimal(generations: CreateAnimalDto[]) {
    try {
      return async function (queryRunner: QueryRunner): Promise<InsertResult> {
        const upsertResult = await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(BreAnimal)
          .values(generations)
          .execute();

        return upsertResult;
      };
    } catch (error) {
      throw error;
    }
  }

  async getAnimalById(animalId: string) {
    try {
      const animal = await this.animalRepository.findOne({
        where: { animal_id: animalId },
        relations: ["animal_breed_id", "animal_type_id", "animal_owner_id"],
      });
      if (!animal) {
        throw new ServiceException({
          message: "Animal not found",
          serviceErrorCode: "AS-101",
        });
      }

      const animalData = {
        ...animal,
        animal_front_view: "",
        animal_right_view: "",
        animal_left_view: "",
        animal_registration: "",
      };

      if (animal.animal_front_view_image !== null) {
        animalData.animal_front_view = await this.s3Service.getLink(
          `${animal.animal_registration_number}/${animal.animal_front_view_image}`,
        );
      }
      if (animal.animal_right_view_image !== null) {
        animalData.animal_right_view = await this.s3Service.getLink(
          `${animal.animal_registration_number}/${animal.animal_right_view_image}`,
        );
      }
      if (animal.animal_left_view_image !== null) {
        animalData.animal_left_view = await this.s3Service.getLink(
          `${animal.animal_registration_number}/${animal.animal_left_view_image}`,
        );
      }
      if (animal.animal_registration_doc !== null) {
        animalData.animal_registration = await this.s3Service.getLink(
          `${animal.animal_registration_number}/${animal.animal_registration_doc}`,
        );
      }
      if (animal.animal_hded_doc !== null) {
        animalData.animal_hded_doc = await this.s3Service.getLink(
          `${animal.animal_registration_number}/${animal.animal_hded_doc}`,
        );
      }
      if (animal.animal_dna_doc !== null) {
        animalData.animal_dna_doc = await this.s3Service.getLink(
          `${animal.animal_registration_number}/${animal.animal_dna_doc}`,
        );
      }
      return animalData;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to get animal details",
        serviceErrorCode: "AS-100",
        httpStatusCode: 500,
      });
    }
  }

  async getAnimalByRegNo(reg_no: string) {
    try {
      const animal = await this.animalRepository.findOne({
        where: { animal_registration_number: reg_no },
        relations: ["animal_breed_id", "animal_type_id", "animal_owner_id"],
      });
      if (!animal) {
        throw new ServiceException({
          message: "Animal not found",
          serviceErrorCode: "AS-101",
        });
      }

      const animalData = {
        ...animal,
        animal_front_view: "",
        animal_right_view: "",
        animal_left_view: "",
        animal_registration: "",
      };

      if (animal.animal_front_view_image !== null) {
        animalData.animal_front_view = await this.s3Service.getLink(
          `${animal.animal_registration_number}/${animal.animal_front_view_image}`,
        );
      }
      if (animal.animal_right_view_image !== null) {
        animalData.animal_right_view = await this.s3Service.getLink(
          `${animal.animal_registration_number}/${animal.animal_right_view_image}`,
        );
      }
      if (animal.animal_left_view_image !== null) {
        animalData.animal_left_view = await this.s3Service.getLink(
          `${animal.animal_registration_number}/${animal.animal_left_view_image}`,
        );
      }
      if (animal.animal_registration_doc !== null) {
        animalData.animal_registration = await this.s3Service.getLink(
          `${animal.animal_registration_number}/${animal.animal_registration_doc}`,
        );
      }
      return animalData;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to get animal details",
        serviceErrorCode: "AS-100",
        httpStatusCode: 500,
      });
    }
  }

  async changeName(body: ChangeNamePayload) {
    try {
      const animal = await this.animalRepository.findOne({
        where: { animal_registration_number: body.animal_registration_number },
      });
      if (!animal) {
        throw new ServiceException({
          message: "Animal not found",
          serviceErrorCode: "AS-101",
        });
      }

      const result = await this.animalRepository.update(
        {
          animal_registration_number: body.animal_registration_number,
        },
        {
          animal_name: body.name,
        },
      );

      if (result.affected > 0) {
        return result.affected;
      }
      throw new ServiceException({
        message: "Failed to change animal name",
        serviceErrorCode: "AS-100",
        httpStatusCode: 500,
      });
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to change animal name",
        serviceErrorCode: "AS-100",
        httpStatusCode: 500,
      });
    }
  }

  async changeOwner(animal_id: string, owner_id: number) {
    try {
      const result = await this.animalRepository.update(
        {
          animal_id,
        },
        {
          animal_owner_id: owner_id,
        },
      );
      if (result.affected > 0) {
        return result.affected;
      }
      throw new ServiceException({
        message: "Failed to change animal owner",
        serviceErrorCode: "AS-100",
        httpStatusCode: 500,
      });
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to change animal owner",
        serviceErrorCode: "AS-100",
        httpStatusCode: 500,
      });
    }
  }

  async getRegisteredAnimals() {
    try {
      const animals = await this.animalRepository.find({
        where: [
          {
            registration_source: animalRegistrationSource.registration,
          },
          {
            registration_source: animalRegistrationSource.litter,
          },
          {
            registration_source: animalRegistrationSource.pedigree,
          },
        ],
        relations: ["animal_type_id", "animal_breed_id", "animal_owner_id"],
      });
      return animals;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to fetch animals",
        serviceErrorCode: "AS-100",
        httpStatusCode: 500,
      });
    }
  }

  async importPedigree(
    payload: AnimalWithPedigreePayload,
    files: Array<Express.Multer.File>,
  ) {
    try {
      const animalData = JSON.parse(payload.animalData);
      const generations = JSON.parse(payload.generations);
      const { animalTypeId, breedId } = payload;
      let animalsCount = await this.animalRepository.count();
      const animalDataDto = new CreateAnimalDto(
        animalData.id,
        animalData.name,
        animalTypeId,
        breedId,
        animalData.gender,
        payload.userId,
        animalData.sireId,
        animalData.damId,
        animalData.pedigree,
        generateRegNo(breedId, animalsCount + 1),
        animalData.colorMarking,
        new Date(animalData.dob),
        animalData.microchip,
        "reg_doc",
        animalRegistrationSource.pedigree,
      );

      const mainAnimalResult = await this.transactionUtils.executeInTransaction(
        this.upsertAnimal([animalDataDto]),
      );
      const uploadData = await this.s3Service.uploadMultiple(
        files,
        animalDataDto.animal_registration_number,
      );
      if (uploadData) {
        await this.animalRepository.update(
          { animal_id: animalDataDto.animal_id },
          {
            animal_registration_doc: fileFilter(files, "certificate")[0]
              .originalname,
          },
        );
        const dna_doc = fileFilter(files, "dnaDoc");

        if (dna_doc.length > 0) {
          await this.animalRepository.update(
            { animal_id: animalDataDto.animal_id },
            {
              animal_dna_doc: dna_doc[0].originalname,
            },
          );
        }
        const hded_doc = fileFilter(files, "hdedDoc");
        if (hded_doc.length > 0) {
          await this.animalRepository.update(
            { animal_id: animalDataDto.animal_id },
            {
              animal_hded_doc: hded_doc[0].originalname,
            },
          );
        }
      }

      animalsCount++;

      const genData = generations.map((g, i) => {
        const reg_no = generateRegNo(breedId, animalsCount + 1 + i);
        return new CreateGenerationsDto(
          g.id,
          g.name,
          animalTypeId,
          breedId,
          g.gender,
          payload.userId,
          g.sireId,
          g.damId,
          g.pedigree,
          reg_no,
        );
      });
      const result = await this.transactionUtils.executeInTransaction(
        this.upsertGenerations(genData),
      );

      return { mainAnimalResult, result };
    } catch (error) {
      console.log("error", error);
      throw new ServiceException({
        message: error?.message ?? "Failed to add animals",
        serviceErrorCode: "AS-100",
      });
    }
  }

  async changeStatus(animal_id: string, status: boolean) {
    try {
      await this.getAnimalById(animal_id);
      const result = await this.animalRepository.update(
        { animal_id: animal_id },
        {
          is_active: status,
        },
      );
      return result;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to change animal status",
        serviceErrorCode: "AS-100",
      });
    }
  }

  async changeMicrochipId(
    animal_registration_number: string,
    microchip_id: string,
  ) {
    try {
      const result = await this.animalRepository.update(
        { animal_registration_number: animal_registration_number },
        {
          animal_microchip_id: microchip_id,
        },
      );
      const animal = await this.animalRepository.findOne({
        where: { animal_registration_number: animal_registration_number },
      });
      return animal;
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to change animal microchip id",
        serviceErrorCode: "AS-100",
      });
    }
  }

  async getAnimalDataForCertificate(animal_id: string) {
    try {
      const animal = await this.getAnimalById(animal_id);
      console.log("animal", animal);

      const farm = await this.breederService.getBreeder(
        // @ts-ignore
        animal.animal_owner_id?.id,
      );
      console.log("farm", farm);

      return { animal, farm };
    } catch (error) {
      throw new ServiceException({
        message: error?.message ?? "Failed to fetch animal data",
        serviceErrorCode: "AS-100",
      });
    }
  }
}
