// message.service.ts
import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Message, User } from '@prisma/client';
import { CreateMessageDto } from 'src/dtos/Create-message.dto';

import { MessageGateway } from './message.gateway';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid'; // Generate unique file names
import * as path from 'path';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService, private readonly messageGateway: MessageGateway) { }

  async getMessagesByRoomId(roomId: string): Promise<Message[] | null>{
    
    const messages = await this.prisma.message.findMany({
      where: {
        roomId: BigInt(roomId),
      },
    });

    return messages;
    
    
  }
  
  
  
  
  
  async createMessage(createMessageDto: any): Promise<void> {
    let { senderId, receiverId, content, roomId,image } = createMessageDto;
    const data = {
      senderId: BigInt(senderId),
      receiverId: BigInt(receiverId),
      content,
      roomId: BigInt(roomId),
      image: image?.filename ?? null, // Check if image is defined before accessing filename
    };

   
   


    if (image) {

      await this.saveImage(image);

    }

    // Create the message and associate it with the sender and receiver

    await this.prisma.message.create({
      data: {
        senderId: BigInt(senderId),
        receiverId: BigInt(receiverId),
        roomId: BigInt(roomId),
        content,
        file: data.image?? null, // Store the image file name in the database
      },
    });

    // Emit the message to the room between the sender and receiver
    const room = this.generateRoomId(senderId, receiverId);
    this.messageGateway.server.to(room).emit('message', {
      senderId,
      content,
      imageFileName: image?.filename ?? null, // Include the image file name in the emitted message
    });
  }

  private generateRoomId(senderId: string, receiverId: string): string {
    return `${senderId}-${receiverId}`;
  }

  private async saveImage(image: any): Promise<void> {
    // Define your local directory path where images will be saved
    const imagePath = __dirname + `/../../uploads/thumbnail/`;
    const imagePath2 = __dirname + `/../../uploads/`;

    // Use sharp to save the image
    try {
      await sharp(imagePath2 + image.filename)
        .webp({ quality: 70 })
        .toFile(path.join(imagePath, image.filename));
    } catch (error) {
      console.error("Error saving image:", error);
    }
  }


  async getAllMessages() {
    return this.prisma.message.findMany();
  }
  // async deleteMessagesWithUser(name:string){
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       name:name, // the primary key value
  //     },
  //   });
  //   this.prisma.message.updateMany({x
  //     where: {
  //       OR: [
  //         { senderId: user.id },
  //         { receiverId: user.id }
  //       ]
  //     },
  //     data:{
  //       deletedAt: new Date()
  //     }
  //   });
  // }
  async softDeleteMessage(msgID: bigint): Promise<Message | null> {
    return this.prisma.message.update({
      where: {
        id: msgID,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

}
