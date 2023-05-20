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
import { EmailModule } from "./lib/mail/mail.module";
import { S3Module } from "./lib/s3multer/s3.module";
import {
  BreCostsMaster,
  BreFarmMaster,
  BreRoleMaster,
} from "./master/master.entity";
import { MasterModule } from "./master/master.module";
import { JWTMiddleware } from "./middleware/jwt/jwt.middleware";
import { JwtModule } from "./middleware/jwt/jwt.module";
import { BreAnimal } from "./modules/animal/animal.entity";
import { AnimalModule } from "./modules/animal/animal.module";
import { BreAnimalMaster } from "./modules/animalMaster/animalMaster.entity";
import { AnimalMasterModule } from "./modules/animalMaster/animalMaster.module";
import { BreAnimalBreedMaster } from "./modules/breedMaster/breedMaster.entity";
import { AnimalBreedMasterModule } from "./modules/breedMaster/breedMaster.module";
import { BreBreeder } from "./modules/breeder/breeder.entity";
import { BreederModule } from "./modules/breeder/breeder.module";
import { BreBreederFarm } from "./modules/breederFarm/breederFarm.entity";
import { BreederFarmModule } from "./modules/breederFarm/breederFarm.module";
import { BreLitterRegistration } from "./modules/litterRegistration/litterRegistration.entity";
import { LitterRegistrationModule } from "./modules/litterRegistration/litterRegistration.module";
import { BreOrders } from "./modules/orders/orders.entity";
import { OrdersModule } from "./modules/orders/orders.module";
import { BreUserSubscription } from "./modules/subscription/subscription.entity";
import { SubscriptionModule } from "./modules/subscription/subscription.module";
import { BreTransferOwnerRequest } from "./modules/transfer-owner/transfer.entity";
import { TransferModule } from "./modules/transfer-owner/transfer.module";
import { BreUser } from "./modules/users/users.entity";
import { UsersModule } from "./modules/users/users.module";
import { dataSourceOptions } from "../db/data-source";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => dataSourceOptions,
      inject: [ConfigService],
    }),
    UsersModule,
    BreederModule,
    MasterModule,
    AnimalModule,
    AnimalMasterModule,
    AnimalBreedMasterModule,
    LitterRegistrationModule,
    TransferModule,
    JwtModule,
    EmailModule,
    S3Module,
    BreederFarmModule,
    OrdersModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JWTMiddleware)
      .exclude(
        { path: "/auth/login", method: RequestMethod.POST },
        {
          path: "/auth/individual",
          method: RequestMethod.POST,
        },
      )
      .forRoutes("*");
  }
}
