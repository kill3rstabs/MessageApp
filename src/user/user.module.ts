// src/user/user.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { PrismaService } from 'src/prisma.service';
// import { AuthModule } from 'src/auth/auth.module';
// import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports:[JwtModule],
  controllers: [UserController],
  providers: [UserService,PrismaService],


})
export class UserModule {}