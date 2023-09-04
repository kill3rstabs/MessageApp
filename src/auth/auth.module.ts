import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService,UserService, LocalStrategy, JwtStrategy,JwtService,PrismaService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}