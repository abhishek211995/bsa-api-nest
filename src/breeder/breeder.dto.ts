import { IsNumber, IsString } from "class-validator";
import { BreUser } from "src/users/users.entity";


export class BreederDto{
    @IsNumber()
    farm_id: number;

    @IsString()
    breeder_license_no: string;
    
    user_id: BreUser;
}