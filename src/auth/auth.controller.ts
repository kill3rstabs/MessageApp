import { Controller, Get, Request, Post, UseGuards, Body, Render } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserLoginDto } from 'src/dtos/Create-userLogin.dto';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}



    @Post('login')
    async login(@Body() createUserLoginDto:CreateUserLoginDto) {
      return this.authService.login(createUserLoginDto);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }
}
