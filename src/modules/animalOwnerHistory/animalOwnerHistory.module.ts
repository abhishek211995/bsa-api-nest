import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BreAnimalOwnerHistory } from "./animalOwnerHistory.entity";
import { BreAnimal } from "../animal/animal.entity";
import { BreUser } from "../users/users.entity";
import { AnimalOwnerHistoryService } from "./animalOwnerHistory.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([BreAnimalOwnerHistory]),
    BreAnimal,
    BreUser,
  ],
  controllers: [],
  providers: [AnimalOwnerHistoryService],
  exports: [AnimalOwnerHistoryService],
})
export class AnimalOwnerHistoryModule {}
