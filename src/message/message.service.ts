// message.service.ts
import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Message, User } from '@prisma/client';
import { CreateMessageDto } from 'src/dtos/Create-message.dto';
import { MessageGateway } from './message.gateway';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid'; // Generate unique file names

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService,private readonly messageGateway: MessageGateway) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<void> {
    const { senderId, receiverId, content,image } = createMessageDto;
    console.log("Message Service");
    // If an image buffer is provided, save it to a local directory
    let imageFileName;

    if (image) {
      imageFileName = `${uuidv4()}.jpg`; // Generate a unique file name
      console.log("message serbive")
      await this.saveImage(image, imageFileName);
      console.log("message servvvvv")
    }

    // Create the message and associate it with the sender and receiver
    console.log(imageFileName);
    await this.prisma.message.create({
      data: {
        senderId: BigInt(senderId),
        receiverId: BigInt(receiverId),
        content,
        file: imageFileName, // Store the image file name in the database
      },
    });

    // Emit the message to the room between the sender and receiver
    const room = this.generateRoomId(senderId, receiverId);
    this.messageGateway.server.to(room).emit('message', {
      senderId,
      content,
      imageFileName,
    });
  }

  private generateRoomId(senderId: string, receiverId: string): string {
    return `${senderId}-${receiverId}`;
  }

  private async saveImage(imageBuffer: Buffer, fileName: string): Promise<void> {
    // Define your local directory path where images will be saved
    const imagePath = `../../uploads/${fileName}`;

    // Use sharp to save the image
    try {
      await sharp(imageBuffer)
        .jpeg({ quality: 70 })
        .toFile(imagePath);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  }


  async getAllMessages(){
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
      data:{
        deletedAt: new Date(),
      },
    });
  }

  





  
}
