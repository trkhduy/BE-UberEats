import { Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Order } from './entities/order.entity';
import { StatusOder } from 'src/status_oder/entities/status_oder.entity';
import { Repository } from 'typeorm';
import { UpdateOderDto } from './dto/update-oder.dto';
import { User } from 'src/user/entities/user.entity';
import { UserAddress } from 'src/user_address/entities/user_address.entity';

@WebSocketGateway(
  {
    cors: true,
  }
)
export class AppGateway implements OnModuleInit {
  private statusData: StatusOder[] = [];
  @WebSocketServer() server: Server;
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(StatusOder)
    private readonly statusRepository: Repository<StatusOder>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserAddress) private readonly userAddressRepository: Repository<UserAddress>
  ) { }
  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log("connected");

    })
  }
  async afterInit() {
    console.log('WebSocket gateway initialized');

    // Load data from database on initialization
    this.statusData = await this.statusRepository.find();
  }
  async handleConnection(client: any) {
    console.log(`Client ${client.id} connected`);
  }

  async handleDisconnect(client: any) {
    console.log(`Client ${client.id} disconnected`);
  }
  @SubscribeMessage('updateStatus')
  async handleUpdateStatus(client: any, id: number, updateOrderDto: UpdateOderDto, statusOderid: number) {
    const order = await this.orderRepository.findOne({ where: [{ 'id': id }] })
    const status = await this.statusRepository.findOne({ where: [{ 'id': updateOrderDto.statusOderid }] })
      if (order) {
        let dataCreate = {
          id:id,
          ...updateOrderDto,
          status: status
        };
        this.server.emit('statusUpdate', dataCreate);
      } else {
        // Invalid status transition
        client.emit('invalidStatusUpdate', 'Invalid status transition detected');
      }
    } 
  
}