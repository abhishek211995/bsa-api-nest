import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BreederDto } from "./breeder.dto";
import { Breeder } from "./breeder.entity";

@Injectable()
export class BreederService{

    constructor(
        @InjectRepository(Breeder)
        private readonly breederRepository: Repository<Breeder>,
    ) { }
    
    createBreeder(breederDto: BreederDto) {
        // const newBreeder = this.breederRepository.create(breederDto);
        // return this.breederRepository.save(newBreeder);
    }
}