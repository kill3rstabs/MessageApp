import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { GatewayModule } from './gateway/gateway.module';
import { MessageGateway } from './message/message.gateway';

@Module({
  imports: [AuthModule,UserModule,MessageModule],
  controllers: [AppController, UserController, MessageController],
  providers: [AppService, UserService, MessageService, PrismaService, MessageGateway] 

})
export class AppModule {}