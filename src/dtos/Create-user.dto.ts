import { IsString,IsEmail,IsNotEmpty} from 'class-validator';
export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsNotEmpty()
    password: string;
  }