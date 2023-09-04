import { IsString,IsEmail,IsNotEmpty } from 'class-validator';
export class CreateUserLoginDto {
    @IsEmail()
    email: string;

    
    @IsNotEmpty()
    password: string;
  }