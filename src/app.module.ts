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
import { BreUser } from "./users/users.entity";
import { UsersModule } from "./users/users.module";
import { BreederModule } from "./breeder/breeder.module";
import { BreBreeder } from "./breeder/breeder.entity";
import { MasterModule } from "./master/master.module";
import {
  BreFarmMaster,
  BreAnimalMaster,
  BreAnimalBreedMaster,
} from "./master/master.entity";
import { AnimalModule } from "./animal/animal.module";
import { MulterService } from "./multer.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "Hrushi@2003",
        database: "breeder",
        entities: [
          BreUser,
          BreBreeder,
          BreFarmMaster,
          BreAnimalMaster,
          BreAnimalBreedMaster,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    BreederModule,
    MasterModule,
    AnimalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MulterService)
      .forRoutes({ path: "auth/register", method: RequestMethod.POST });
  }
}
