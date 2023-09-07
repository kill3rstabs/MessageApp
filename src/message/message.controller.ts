// message.controller.ts
import { Get, Controller, Post, Body, Param, Delete, Render, Res,UploadedFile, UploadedFiles  } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from 'src/dtos/Create-message.dto';
import { Create } from 'sharp';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UseInterceptors } from '@nestjs/common';
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  

  @Get(':roomId')
  @Render('message') 
  async getMessagesByRoomId(@Param('roomId') roomId: string) {
    const messages = await this.messageService.getMessagesByRoomId(roomId);
    console.log(messages);
    return {messages:messages}

  }
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // Define your upload directory
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createMessage(@UploadedFile() image,
  @Body() body: { senderId: string; receiverId: string; content: string;}) {
    console.log('FormData:', body);
    console.log('Image:', image);

    const data = {
      senderId: body.senderId,
      receiverId: body.receiverId,
      content: body.content,
      roomId: body.senderId + body.receiverId,
      image: image?? null,
    };
    console.log(typeof(data.roomId));
    return await this.messageService.createMessage(data);
  }
  @Delete(':id')
  async deleteMessage(@Param('id') id: string) {
    return this.messageService.softDeleteMessage(BigInt(JSON.parse(id)))
  }


  // @Get(':name')
  // @Render('message')
  // async getAllMessages(@Param('name') name: string) {
  //   return { name: name }
  // }
}
