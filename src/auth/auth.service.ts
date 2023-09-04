import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { Message, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    console.log("Email: ",email," Pass:",pass)
    const lowerCaseEmail = email.toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: {
        email: lowerCaseEmail,
      },
    });
    console.log(user)
    if (user && await bcrypt.compare(pass, user.password)) {
      console.log("User found");
      return user;
    }
    return null;
  }

  async login(usr : any) {
    console.log(usr);
    // return
    const user = await this.validateUser(usr.email, usr.password);
    
    console.log(user)
    if (user) {
      
      const payload = { email: user.email, sub: user.id.toString() };
      
      return {
        access_token: this.jwtService.sign(payload, { secret: 'secret' }),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
