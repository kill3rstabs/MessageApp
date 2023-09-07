// message.gateway.ts
import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    this.server.to(room).emit('message', 'A new user has joined the room.');
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(client: Socket, data: { room: string, message: string }) {
    const { room, message } = data;
    this.server.to(room).emit('message', `${client.id}: ${message}`);
  }

  @SubscribeMessage('sendImage')
  handleSendImage(client: Socket, data: { room: string, image: string }) {
    const { room, image } = data;
    this.server.to(room).emit('image', image);
  }
}
