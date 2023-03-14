import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class Users {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty()
  @Column({ nullable: false, name: "user_name", length: 50, default: true })
  user_name: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  email: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  password: string;
}
