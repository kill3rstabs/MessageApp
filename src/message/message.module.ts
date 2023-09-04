// src/message/message.module.ts

import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { PrismaService } from 'src/prisma.service';
import { MessageGateway } from './message.gateway';


@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageGateway,PrismaService],
})
export class MessageModule {}
