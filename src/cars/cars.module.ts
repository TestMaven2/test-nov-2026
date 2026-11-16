import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { CarsRepository } from './cars.repository';

@Module({
  controllers: [CarsController],
  providers: [CarsRepository],
  imports: [TypeOrmModule.forFeature([Car])],
})
export class CarsModule {}
