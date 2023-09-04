// message.controller.ts
import { Get, Controller, Post, Body, Param, Delete,Render,Res } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from 'src/dtos/Create-message.dto';
import { Create } from 'sharp';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post('/')
  async createMessage(@Body() data: any) {

    
   console.log(data);
    return await this.messageService.createMessage(data);
  }
  @Delete(':id')
  async deleteMessage(@Param('id') id: string) {
    return this.messageService.softDeleteMessage(BigInt(JSON.parse(id)))
  }


  @Get(':name')
  @Render('message')
  async getAllMessages(@Param('name') name: string) {
    return {name:name}
  }
}
