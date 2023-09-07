import { IsString,IsEmail,IsNumberString, IsOptional } from 'class-validator';
export class CreateMessageDto {
    @IsString()
    messageContent: string;
    @IsString()
     senderId: string;
     @IsString()
    receiverId: string;
    @IsOptional()
    image:any;
  }