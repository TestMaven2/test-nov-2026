import { Module } from '@nestjs/common';
import { PoliciesController } from './policies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Policy } from './policy.entity';
import { PoliciesRepository } from './policies.repository';

@Module({
  controllers: [PoliciesController],
  providers: [PoliciesRepository],
  imports: [TypeOrmModule.forFeature([Policy])],
})
export class PoliciesModule {}
