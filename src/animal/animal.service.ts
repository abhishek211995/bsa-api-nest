import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InsertResult, QueryRunner, Repository } from "typeorm";
import {
  AnimalDto,
  AnimalWithPedigreePayload,
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

  async createAnimal(animalDto: AnimalDto) {
    const animalCount = await this.animalRepository.count();
    animalDto.animal_registration_number = generateRegNo(
      animalDto.animal_breed_id,
      animalCount + 1,
    );
    const AnimalData = await this.animalRepository.create(animalDto);
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
  async updateAnimalDocDetails(
    animal_front_view_image: string,
    animal_right_view_image: string,
    animal_left_view_image: string,
    animal_registration_doc: string,
    animal_id: string,
  ) {
    const animal = await this.animalRepository.findOne({
      where: {
        animal_id,
      },
    });
    animal.animal_front_view_image = animal_front_view_image;
    animal.animal_right_view_image = animal_right_view_image;
    animal.animal_left_view_image = animal_left_view_image;
    animal.animal_registration_doc = animal_registration_doc;
    return this.animalRepository.save(animal);
  }

  async createAnimalWithPedigree(payload: AnimalWithPedigreePayload) {
    try {
      const { animalData, animalTypeId, breedId, generations } = payload;
      let animalsCount = await this.animalRepository.count();
      const addAnimalResponse = this.animalRepository.create({
        animal_breed_id: breedId,
        animal_color_and_markings: animalData.colorMarking,
        animal_dam_id: animalData.damId,
        animal_date_of_birth: animalData.dob,
        animal_gender: animalData.gender,
        animal_id: animalData.id,
        animal_microchip_id: animalData.microchip,
        animal_name: animalData.name,
        animal_owner_id: 1,
        animal_pedigree: animalData.pedigree,
        animal_registration_doc: "doc",
        animal_sire_id: animalData.sireId,
        animal_type_id: animalTypeId,
        animal_registration_number: generateRegNo(breedId, animalsCount + 1),
      });
      animalsCount++;
      await this.animalRepository.save(addAnimalResponse);
      const genData = generations.map((g) => {
        const reg_no = generateRegNo(breedId, animalsCount + 1);
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
      await this.transactionUtils.executeInTransaction(
        this.upsertUser(genData),
      );
    } catch (error) {}
  }

  upsertUser(generations: CreateGenerationsDto[]) {
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
