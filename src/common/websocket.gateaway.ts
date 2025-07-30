import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from 'src/model/request-payload.model';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketGateaway {
  @WebSocketServer()
  server: Server;
  constructor(private jwtService: JwtService) {}

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token as string;

      const payload = this.jwtService.verify<JwtPayload>(token);

      console.log(`Client connected: ${client.id}`);
      console.log(`payload: ${JSON.stringify(payload)}`);
    } catch (error) {
      console.error('Unauthotized Websocket Connection', error);
      client.disconnect();
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { role: string; userId?: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (data.role === 'ADMIN') {
        await client.join('ADMIN');
        client.emit('joined: ', 'Joined room : ADMIN');
      } else if (data.role === 'ADMINUSERS') {
        await client.join('ADMINUSERS');
        client.emit('Joined: ', 'Joined room: USERSADMIN');
      }
    } catch (error) {
      console.error(`Failed to join room ${error}`);
      client.emit('error', 'Gagal joint ke room');
    }
  }
  broadcastToAdmin(data: any) {
    this.server.to('ADMIN').emit('users_update', data);
  }

  broadcastToAdminUsers(data: any) {
    this.server.to('ADMINUSERS').emit('antrian_pasiens_update', data);
  }
}
