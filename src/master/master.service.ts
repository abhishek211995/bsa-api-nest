import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AnimalBreedDto, AnimalTypeDto, FarmTypeDto } from "./master.dto";
import {
  BreAnimalBreedMaster,
  BreAnimalMaster,
  BreFarmMaster,
} from "./master.entity";

@Injectable()
export class FarmTypeServices {
  constructor(
    @InjectRepository(BreFarmMaster)
    private readonly breFarmMasterRepository: Repository<BreFarmMaster>,
  ) {}

  // Add farm
  addFarmType(farmTypeDto: FarmTypeDto) {
    const farm = this.breFarmMasterRepository.create(farmTypeDto);
    return this.breFarmMasterRepository.save(farm);
  }

  getAllFarmTypes() {
    return this.breFarmMasterRepository.find();
  }
}

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
}

@Injectable()
export class AnimalBreedServices {
  constructor(
    @InjectRepository(BreAnimalBreedMaster)
    private readonly breAnimalBreedMasterRepository: Repository<BreAnimalBreedMaster>,
  ) {}

  // Add animal breed
  addAnimalBreed(animalBreedDto: AnimalBreedDto) {
    const breed = this.breAnimalBreedMasterRepository.create(animalBreedDto);
    return this.breAnimalBreedMasterRepository.save(breed);
  }

  // Get animal breed by animal type id
  getAnimalBreedByAnimalType(animal_type_id: number) {
    return this.breAnimalBreedMasterRepository.find({
      where: { animal_type_id: animal_type_id },
    });
  }
}
