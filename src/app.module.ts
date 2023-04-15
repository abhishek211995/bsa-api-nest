import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JWTMiddleware } from "./middleware/jwt/jwt.middleware";
import { JwtModule } from "./middleware/jwt/jwt.module";
import { MailModule } from "./lib/mail/mail.module";
import { S3Module } from "./lib/s3multer/s3.module";
import {
  BreAnimalBreedMaster,
  BreCostsMaster,
  BreFarmMaster,
  BreRoleMaster,
  BreSubscriptionsMaster,
} from "./master/master.entity";
import { MasterModule } from "./master/master.module";
import { BreAnimal } from "./modules/animal/animal.entity";
import { AnimalModule } from "./modules/animal/animal.module";
import { BreBreeder } from "./modules/breeder/breeder.entity";
import { BreederModule } from "./modules/breeder/breeder.module";
import { BreTrasferOwnerRequest } from "./modules/transfer-owner/transfer.entity";
import { TransferModule } from "./modules/transfer-owner/transfer.module";
import { BreUser } from "./modules/users/users.entity";
import { UsersModule } from "./modules/users/users.module";
import { BreAnimalMaster } from "./modules/animalMaster/animalMaster.entity";
import { AnimalMasterModule } from "./modules/animalMaster/animalMaster.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USER"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        entities: [
          BreUser,
          BreBreeder,
          BreFarmMaster,
          BreAnimalMaster,
          BreAnimalBreedMaster,
          BreAnimal,
          BreCostsMaster,
          BreSubscriptionsMaster,
          BreRoleMaster,
          BreTrasferOwnerRequest,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    BreederModule,
    MasterModule,
    AnimalModule,
    AnimalMasterModule,
    TransferModule,
    JwtModule,
    MailModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTMiddleware).forRoutes(
      {
        path: "auth/users",
        method: RequestMethod.GET,
      },
      {
        path: "animal/getAnimals",
        method: RequestMethod.GET,
      },
    );
  }
}
