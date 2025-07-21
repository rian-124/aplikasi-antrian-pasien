import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketGateaway {
  @WebSocketServer()
  server: Server;

  broadcastStatusUpdate(data: any) {
    this.server.emit('Antrian-pasien update', data);
  }
}
