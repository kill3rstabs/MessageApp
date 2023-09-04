import { IsString,IsEmail,IsNumberString, IsOptional } from 'class-validator';
export class CreateMessageDto {
    @IsString()
    content: string;
    @IsString()
     senderId: string;
     @IsString()
    receiverId: string;
    @IsOptional()
    image:any;
  }