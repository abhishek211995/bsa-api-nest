import { IsNumber, IsString } from "class-validator";

export class AnimalBreedDto {
  @IsNumber()
  animal_type_id: number;

  @IsString()
  animal_breed_name: string;

  @IsString()
  animal_breed_description: string;
}

export class EditAnimalBreed extends AnimalBreedDto {
  @IsNumber()
  breed_id: number;

  @IsString()
  animal_breed_name: string;

  @IsString()
  animal_breed_description: string;
}
