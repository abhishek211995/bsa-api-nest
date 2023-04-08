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

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(BreAnimal)
    private readonly animalRepository: Repository<BreAnimal>,
    private transactionUtils: TransactionUtil,
  ) {}

  createAnimal(animalDto: AnimalDto) {
    const AnimalData = this.animalRepository.create(animalDto);
    return this.animalRepository.save(AnimalData);
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
    animal_registration_no,
  }: {
    animal_microchip_id: string;
    animal_registration_no: string;
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
          // animal_registration_id,
        },
        relations: ["animal_owner"],
      });
    }
  }

  async createAnimalWithPedigree(payload: AnimalWithPedigreePayload) {
    try {
      console.log("reached=>>>>");
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

      const mainAnimalResult = this.transactionUtils.executeInTransaction(
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
    } catch (error) {}
  }

  upsertGenerations(generations: CreateGenerationsDto[]) {
    return async function (queryRunner: QueryRunner): Promise<InsertResult> {
      const upsertResult = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(BreAnimal)
        .values(generations)
        .execute();

      return upsertResult;
    };
  }

  upsertAnimal(generations: CreateAnimalDto[]) {
    return async function (queryRunner: QueryRunner): Promise<InsertResult> {
      const upsertResult = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(BreAnimal)
        .values(generations)
        .execute();

      return upsertResult;
    };
  }
}
