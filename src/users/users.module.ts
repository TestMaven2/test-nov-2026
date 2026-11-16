import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersRepository],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
