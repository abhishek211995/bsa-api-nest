import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BreUser } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { BreederModule } from './breeder/breeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'Hrushi@2003',
        database: 'breeder',
        entities: [BreUser],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    BreederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
