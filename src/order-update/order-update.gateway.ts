import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class OrderUpdateGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server
  handleConnection(client: any, ...args: any[]) {
    console.log('connection...');
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    this.server.emit("getMes", this.handleGetMessage())
    return 'Hello world!';
  }
  handleGetMessage(): string {
    this.server.emit("getMes", 'get 2')
    return 'Hello world!';
  }
}
