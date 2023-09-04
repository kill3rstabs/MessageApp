// user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(email: string): Promise<User | null> {
    const lowerCaseEmail = email.toLowerCase();
    return this.prisma.user.findUnique({
      where: {
        email: lowerCaseEmail,
      },
    });
  }

  async insertUser(email: string, name:string,password: string): Promise<User> {
    const lowerCaseEmail = email.toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: {
        email: lowerCaseEmail
      },
    });
    if (user) {
      console.log("Usrer already exists");
      return null;
    } else {
      
    return this.prisma.user.create({
      data:{
        email: lowerCaseEmail,
        name: name,
        password
      },
    }) };
  }

  async getMessagesSentByUser(id: bigint) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        messagesSent: true,
      },
    });
  }

  async getUserByUsername(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }



  


  async validateUser(username: string, password: string) {
    const user = await this.getUserByUsername(username);
    
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async getMessagesReceivedByUser(id: bigint) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        messagesReceived: true,
      },
    });
  }

  async userComeback(id: bigint){
    return this.prisma.user.update({
      where : {id},
      data: {deletedAt: null }
    }
    
    )
  }

  async softDeleteUser(email: string): Promise<User | null> {
    
    return this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        deletedAt: new Date(), // Set the deletedAt field to the current timestamp
      },
    });
  }
}
