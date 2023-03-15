import { IsNumber, IsString } from "class-validator";


export class BreederDto{
    @IsNumber()
    farm_id: number;

    @IsString()
    breeder_license_no: string;

    @IsNumber()
    user_id: number;
}