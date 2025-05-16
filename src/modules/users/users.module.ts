// users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { AuthService } from './resetPassword/auth.service';
import { AuthController } from './resetPassword/auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController,AuthController],
  providers: [UsersService,AuthService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
