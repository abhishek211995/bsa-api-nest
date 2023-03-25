import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AnimalDto } from "./animal.dto";
import { BreAnimal } from "./animal.entity";

@Injectable()
export class AnimalService{
    constructor(
        @InjectRepository(BreAnimal)
        private readonly animalRepository: Repository<BreAnimal>,
    ) { }
    
    createAnimal(animalDto: AnimalDto) {
        const AnimalData = this.animalRepository.create(animalDto);
        return this.animalRepository.save(AnimalData);
    }
}