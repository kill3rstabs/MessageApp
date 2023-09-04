import { WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  users: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    this.users.set(client.id, client);
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.users.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(client: Socket, message: { room: string, content: string }) {
    const { room, content } = message;
    
    this.server.to(room).emit('message', { senderId: client.id, content });
  }

  @SubscribeMessage('sendImage')
  handleSendImage(client: Socket, message: { room: string, content: string }) {
    const { room, content } = message;
    this.server.to(room).emit('image', { senderId: client.id, content });
  }
}