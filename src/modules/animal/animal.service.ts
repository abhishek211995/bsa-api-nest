import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InsertResult, QueryRunner, Repository } from "typeorm";
import {
  AnimalDto,
  AnimalWithPedigreePayload,
  CreateAnimalDto,
  CreateGenerationsDto,
} from "./animal.dto";
import { BreAnimal } from "./animal.entity";
import TransactionUtil from "src/lib/db_utils/transaction.utils";
import { generateRegNo } from "src/utils/generateReg.util";
import { S3Service } from "src/lib/s3multer/s3.service";
import { fileFilter } from "src/utils/fileFilter.util";

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(BreAnimal)
    private readonly animalRepository: Repository<BreAnimal>,
    private transactionUtils: TransactionUtil,
    private readonly s3Service: S3Service,
  ) {}

  async createAnimal(animalDto: AnimalDto, files: Array<Express.Multer.File>) {
    const animalCount = await this.animalRepository.count();
    animalDto.animal_registration_number = await generateRegNo(
      animalDto.animal_breed_id,
      animalCount + 1,
    );
    const AnimalData = await this.animalRepository.create(animalDto);
    const animal = await this.animalRepository.save(AnimalData);
    if (animal) {
      console.log("animal", animal);

      const uploadData = await this.s3Service.uploadMultipleImages(
        files,
        animal.animal_registration_number,
      );
      if (uploadData) {
        const updateDoc = await this.updateAnimalDocDetails({
          animal_id: animal.animal_id,
          animal_front_view_image: fileFilter(
            files,
            "animal_front_view_image",
          )[0].originalname,
          animal_left_view_image: fileFilter(files, "animal_left_view_image")[0]
            .originalname,
          animal_right_view_image: fileFilter(
            files,
            "animal_right_view_image",
          )[0].originalname,
        });
      }
      return { animal, uploadData };
    }
  }

  // get all animals of user by animal type id and gender
  getAllAnimalByAnimalType({
    user_id,
    animal_type_id,
    gender,
  }: {
    user_id: number;
    animal_type_id: number;
    gender: string;
  }) {
    const data = this.animalRepository.find({
      where: {
        animal_owner_id: user_id,
        animal_type_id,
        animal_gender: gender,
      },
    });
    return data;
  }

  // get animal and owner details by animal microchip id or registration id
  getAnimalAndOwner({
    animal_microchip_id,
    animal_registration_number,
  }: {
    animal_microchip_id: string;
    animal_registration_number: string;
  }) {
    if (animal_microchip_id != "") {
      return this.animalRepository.findOne({
        where: {
          animal_microchip_id,
        },
        relations: ["animal_owner_id"],
      });
    } else {
      return this.animalRepository.findOne({
        where: {
          animal_registration_number,
        },
        relations: ["animal_owner"],
      });
    }
  }

  // update animal document details
  async updateAnimalDocDetails({
    animal_front_view_image,
    animal_right_view_image,
    animal_left_view_image,
    animal_id,
  }) {
    const animal = await this.animalRepository.findOne({
      where: {
        animal_id,
      },
    });
    animal.animal_front_view_image = animal_front_view_image;
    animal.animal_right_view_image = animal_right_view_image;
    animal.animal_left_view_image = animal_left_view_image;
    return this.animalRepository.save(animal);
  }

  async createAnimalWithPedigree(payload: AnimalWithPedigreePayload) {
    try {
      const { animalData, animalTypeId, breedId, generations } = payload;
      let animalsCount = await this.animalRepository.count();
      const animalDataDto = new CreateAnimalDto(
        animalData.id,
        animalData.name,
        animalTypeId,
        breedId,
        animalData.gender,
        1,
        animalData.sireId,
        animalData.damId,
        animalData.pedigree,
        generateRegNo(breedId, animalsCount + 1),
        animalData.colorMarking,
        new Date(animalData.dob),
        animalData.microchip,
        "reg_doc",
      );

      const mainAnimalResult = await this.transactionUtils.executeInTransaction(
        this.upsertAnimal([animalDataDto]),
      );
      animalsCount++;
      const genData = generations.map((g, i) => {
        const reg_no = generateRegNo(breedId, animalsCount + 1 + i);
        return new CreateGenerationsDto(
          g.id,
          g.name,
          animalTypeId,
          breedId,
          g.gender,
          1,
          g.sireId,
          g.damId,
          g.pedigree,
          reg_no,
        );
      });
      const result = await this.transactionUtils.executeInTransaction(
        this.upsertGenerations(genData),
      );

      console.log("result", result);
      console.log("addResponse", mainAnimalResult);
      return { mainAnimalResult, result };
    } catch (error) {
      throw error;
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
}
