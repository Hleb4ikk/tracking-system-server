import {
  CreateOrderDto,
  OrderFilters,
  UpdateOrderDto,
} from 'src/schemas/orderSchemas';
import { Order, OrderWithHistory, OrderWithDetails } from 'src/types/Order';

export interface IOrderRepository {
  findOrders(
    limit: number,
    page: number,
    filters?: OrderFilters,
  ): Promise<OrderWithHistory[]>;

  findOrderById(orderId: string): Promise<Order>;

  findOrderWithDetailsById(orderId: string): Promise<OrderWithDetails>;

  createOrder(
    companyId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<Order>;

  updateOrder(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Partial<Order>>;

  deleteOrder(orderId: string): Promise<void>;
}
