import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreederController } from './breeder.controller';
import { Breeder } from './breeder.entity';
import { BreederService } from './breeder.service';

@Module({
    imports: [TypeOrmModule.forFeature([Breeder])],
    controllers: [BreederController],
    providers: [BreederService],
    exports: [BreederService],
})
export class BreederModule {}
