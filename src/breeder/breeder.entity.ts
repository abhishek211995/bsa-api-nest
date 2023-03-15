import { ApiProperty } from "@nestjs/swagger";
import { BreUser } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("bre_breeder")
export class Breeder{
    @ApiProperty()
    @PrimaryGeneratedColumn()
    breeder_id: number;

    @ApiProperty()
    @Column({ nullable: false, length: 50, default: "" })
    farm_id: number;
    
    @ApiProperty()
    @Column({ nullable: false, length: 50, default: "" })
    breeder_license_no: string;

    @ApiProperty()
    @Column({ nullable: false, length: 50, default: "" })
    @OneToOne(() => BreUser)
    user_id: BreUser;

    @ApiProperty()
    @CreateDateColumn()
    breeder_created_at: Date;

    @ApiProperty()
    @UpdateDateColumn()
    breeder_updated_at: Date;
}