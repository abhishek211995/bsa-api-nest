import { Controller } from "@nestjs/common";
import { Body, Post } from "@nestjs/common/decorators";
import { AnimalDto } from "./animal.dto";
import { AnimalService } from "./animal.service";

@Controller("animal")
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}
  @Post("create")
  async RegisterAnimal(@Body() animalDto: AnimalDto) {
    try {
      const res = await this.animalService.createAnimal(animalDto);
      if (res) {
        return { status: 200, message: "Animal created successfully" };
      }
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }
}
