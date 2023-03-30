import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AnimalDto } from "./animal.dto";
import { BreAnimal } from "./animal.entity";

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(BreAnimal)
    private readonly animalRepository: Repository<BreAnimal>,
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
    if(animal_microchip_id != "") {
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
}
