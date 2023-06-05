import { InjectRepository } from '@nestjs/typeorm';
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket, } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Order } from 'src/oder/entities/order.entity';
import { OrderService } from 'src/oder/order.service';
import { User } from 'src/user/entities/user.entity';

@WebSocketGateway({ cors: true })
export class OrderUpdateGateway implements OnGatewayConnection {
  constructor(
    @InjectRepository(Order) private readonly orderService: OrderService,
    // @InjectRepository(User) private readonly authService: AuthService,

  ) { }
  @WebSocketServer()
  server: Server
  async handleConnection(socket: Socket) {
    console.log('connect', socket.id);
    socket.join(socket.id);
    this.server.emit('test', 'test')
    const authHeader = socket.handshake.headers.authorization;
    // if (authHeader && (authHeader as string).split(' ')[1]) {
    //   try {
    //     socket.data.userid = (await this.authService.getUserFromAuthenticationToken(
    //       (authHeader as string).split(' ')[1],
    //     )).toString();
    //     socket.join(socket.data.userid);
    //     console.log('connect success', socket.data.userid);
    //   } catch (e) {
    //     socket.disconnect();
    //   }
    // } else {
    //   socket.disconnect();
    // }
    // socket.data.userid = '1'
    // socket.join(socket.data.userid);

  }
  @SubscribeMessage('GetOrderRestaurant')
  async handleGetOrderTo(orderData: any, to: number) {
    try {
      // let data = await this.orderService.findByUser(restaurantId)
      this.server.emit("GetOrderRestaurant", orderData)
      return true;
    } catch (error) {
      return console.log('GetOrderRestaurant', error);
    }
  }
  @SubscribeMessage('GetDetailOrderDriver')
  handleGetDetailOrderToDriver(orderData: any, restaurantId: number) {
    try {
      this.server.emit("GetDtailOrderDriver", orderData)
      return true;
    } catch (error) {
      return console.log('GetDetailOrderDriver', error);
    }
  }
  @SubscribeMessage('GetOrderDriver')
  handleGetOrderToDriver(orderData: any, restaurantId: number) {
    try {
      this.server.emit("GetOrderDriver", orderData)
      return true;
    } catch (error) {
      return console.log('GetOrderDriver', error);
    }
  }
  handleUpdateOrder(orderData: any, to: any) {
    try {
      this.server.to(to).emit("GetOrderRestaurant", orderData)
      return true;
    } catch (error) {
      return console.log('GetOrderRestaurant', error);
    }
  }
  // handleSendOrderTo(to: any): string {
  //   this.server.to(to).emit("getMes", 'hello3')
  //   this.server.to(['1', '5']).emit("getMes", 'hello2')
  //   this.server.emit("getMes", 'hello')
  //   return 'Hello world!';
  // }
}
