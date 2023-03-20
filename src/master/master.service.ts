import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AnimalTypeDto, FarmTypeDto } from "./master.dto";
import { BreAnimalMaster, BreFarmMaster } from "./master.entity";

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
