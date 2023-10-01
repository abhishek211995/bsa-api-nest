import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "../db/data-source";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EmailModule } from "./lib/mail/mail.module";
import { S3Module } from "./lib/s3multer/s3.module";
import { MasterModule } from "./master/master.module";
import { JWTMiddleware } from "./middleware/jwt/jwt.middleware";
import { JwtModule } from "./middleware/jwt/jwt.module";
import { AnimalModule } from "./modules/animal/animal.module";
import { AnimalMasterModule } from "./modules/animalMaster/animalMaster.module";
import { AnimalBreedMasterModule } from "./modules/breedMaster/breedMaster.module";
import { BreederModule } from "./modules/breeder/breeder.module";
import { BreederFarmModule } from "./modules/breederFarm/breederFarm.module";
import { LitterRegistrationModule } from "./modules/litterRegistration/litterRegistration.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { SubscriptionModule } from "./modules/subscription/subscription.module";
import { TransferModule } from "./modules/transfer-owner/transfer.module";
import { UsersModule } from "./modules/users/users.module";
import { AnimalOwnerHistoryModule } from "./modules/animalOwnerHistory/animalOwnerHistory.module";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { CcavenueModule } from "./modules/ccavenue/ccavenue.module";
import { CoursesModule } from "./modules/courses/courses.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => dataSourceOptions,
      inject: [ConfigService],
    }),
    RedisModule.forRoot({
      config: {
        host: "localhost",
        port: 6379,
      },
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
    AnimalOwnerHistoryModule,
    CcavenueModule,
    CoursesModule,
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
        { path: "/", method: RequestMethod.GET },
        {
          path: "/auth/individual",
          method: RequestMethod.POST,
        },
        {
          path: "master/getAllCosts",
          method: RequestMethod.GET,
        },
        {
          path: "auth/forgot-password",
          method: RequestMethod.POST,
        },
        {
          path: "auth/reset-password",
          method: RequestMethod.PUT,
        },
        {
          path: "orders/complete/ccAvenue",
          method: RequestMethod.POST,
        },
        {
          path: "auth/test-email-service",
          method: RequestMethod.POST,
        },
      )
      .forRoutes("*");
  }
}
