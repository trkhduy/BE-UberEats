import { Test, TestingModule } from '@nestjs/testing';
import { OrderUpdateGateway } from './order-update.gateway';

describe('OrderUpdateGateway', () => {
  let gateway: OrderUpdateGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderUpdateGateway],
    }).compile();

    gateway = module.get<OrderUpdateGateway>(OrderUpdateGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
