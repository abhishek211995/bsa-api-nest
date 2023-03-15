import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

enum UserType {
  "admin",
  "breeder",
  "individual",
}

enum UserStatus {
  "Verified" = 1,
  "Verification Pending" = 2,
}

// create bre_user table with id, user_name,user_type_id, email, password,contact_no,user_country,identification_id_no,identification_id_name,user_created_at,user_updated_at,user_status
@Entity("bre_user")
export class BreUser {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: true })
  user_name: string;

  @ApiProperty()
  @Column({ type: "enum", enum: UserType })
  user_role_id: UserType;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "", unique: true })
  email: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  password: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "", unique: true })
  contact_no: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  user_country: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "", unique: true })
  identification_id_no: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  identification_id_name: string;

  @ApiProperty()
  @Column({ nullable: false, length: 50, default: "" })
  identity_doc_name: string;

  @ApiProperty()
  @CreateDateColumn()
  user_created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  user_updated_at: Date;

  @ApiProperty()
  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus["Verification Pending"],
  })
  user_status: UserStatus;
}

// @Entity("users")
// export class Users {
//   @ApiProperty()
//   @PrimaryGeneratedColumn()
//   id: string;

//   @ApiProperty()
//   @Column({ nullable: false, name: "user_name", length: 50, default: true })
//   user_name: string;

//   @ApiProperty()
//   @Column({ nullable: false, length: 50, default: "" })
//   email: string;

//   @ApiProperty()
//   @Column({ nullable: false, length: 50, default: "" })
//   password: string;
// }
