// user.controller.ts
import { UseGuards, Controller, Get, Post, Body, Param, Delete, Render, Redirect, Req, Res, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { MessageService } from 'src/message/message.service';
// import { Request, Response } from 'express';
import { Session } from 'express-session';
// import { AuthenticatedGuard } from './auth/authenticated.guard';
// import { LocalAuthGuard } from './auth/local.auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from 'src/dtos/Create-user.dto';
var JSONbig = require('json-bigint');


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService, private prisma: PrismaService) { }

  // @Get()
  // async getUsers() {
  //   return this.userService.getUsers();
  // }
  @Get('/home')
  @Render('message')
  userHome() { }



  @Post()
  @Redirect('/users/home')
  async createUser(@Body() data: { username: string, password: string }) {
    return this.userService.insertUser(data[0], data[1],data[2]);
  }
  @Get('/login')
  async login(){
    return "login";
  }
  @Post('/signup')
  async addUser(
    @Body() createUserDto: CreateUserDto
  ) {
      const {email,name,password}=createUserDto
      const userPassword = password;
      //hash password
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(userPassword, saltOrRounds);

      const result = await this.userService.insertUser(
        email,
        name,
        hashedPassword,
      );
      if(!result) return {msg: "User already exists"}
      return { id: result.id.toString(),
        email: result.email,
      };
  }



  //Get / protected
  // @UseGuards(AuthenticatedGuard)
  // @Get('/protected')
  // getHello(@Request() req): string {
  //   return req.user;
  // };

  //Get / logout
  @Get('/logout')
  logout(@Request() req): any {
    req.session.destroy()
    return { msg: 'The user session has ended' }
  }

  @Get(':id/messages/sent')
  async getMessagesSentByUser(@Param('id') id: string) {
    return this.userService.getMessagesSentByUser(BigInt(JSON.parse(id)));
  }

  @Get('/:id/usercomeback')
  async userComeback(@Param('id') id: string) {
    this.userService.userComeback(BigInt(JSON.parse(id)));
    return "user deleted!!";
  }

  @Get(':id/messages/received')
  async getMessagesReceivedByUser(@Param('id') id: string) {


    return this.userService.getMessagesReceivedByUser(BigInt(JSON.parse(id)));
  }

  @Delete(':name')
  async softDeleteUser(@Param('name') name: string) {
    // this.messageService.deleteMessagesWithUser(name);
    return this.userService.softDeleteUser(name);
  }
}
