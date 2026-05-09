import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import {
  CreateOrderDto,
  OrderFilters,
  UpdateOrderDto,
} from 'src/schemas/orderSchemas';
import { CompanyRepository } from '../company/company.repository';
import { UserRepository } from '../user/user.repository';
import { RecieverRepository } from '../reciever/reciever.repository';
import { Order, OrderWithHistory } from 'src/types/Order';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
    private readonly recieverRepository: RecieverRepository,
  ) {}

  async findOrders(
    page: number,
    limit: number,
    filters?: OrderFilters,
  ): Promise<OrderWithHistory[]> {
    if (filters?.companyId) {
      const company = await this.companyRepository.findCompanyById(
        filters.companyId,
      );
      if (!company) {
        throw new NotFoundException("Company from filters wasn't found.");
      }
    }

    if (filters?.responsibleId) {
      const user = await this.userRepository.findUserById(
        filters.responsibleId,
      );
      if (!user) {
        throw new NotFoundException("Responsible user wasn't found.");
      }
    }

    if (filters?.recieverId) {
      const reciever = await this.recieverRepository.findRecieverById(
        filters.recieverId,
      );
      if (!reciever) {
        throw new NotFoundException("Reciever wasn't found.");
      }
    }

    return await this.orderRepository.findOrders(limit, page, filters);
  }

  async findOrderById(
    companyId: string,
    orderId: string,
  ): Promise<OrderWithHistory> {
    const order = await this.orderRepository.findOrderWithHistoryById(orderId);

    if (!order || order.company_id !== companyId) {
      throw new NotFoundException("Order wasn't found.");
    }

    return order;
  }

  async createOrder(
    companyId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const company = await this.companyRepository.findCompanyById(companyId);
    if (!company) {
      throw new NotFoundException("User company wasn't found to create order.");
    }

    const responsible = await this.userRepository.findUserById(
      createOrderDto.responsibleId,
    );
    if (!responsible) {
      throw new NotFoundException("Responsible user wasn't found.");
    }

    const reciever = await this.recieverRepository.findRecieverById(
      createOrderDto.recieverId,
    );
    if (!reciever) {
      throw new NotFoundException("Reciever wasn't found.");
    }

    return await this.orderRepository.createOrder(companyId, createOrderDto);
  }

  async updateOrder(
    companyId: string,
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Partial<Order>> {
    const order = await this.orderRepository.findOrderById(orderId);

    if (!order || order.company_id !== companyId) {
      throw new NotFoundException("Order wasn't found.");
    }

    if (updateOrderDto.responsibleId) {
      const responsible = await this.userRepository.findUserById(
        updateOrderDto.responsibleId,
      );
      if (!responsible) {
        throw new NotFoundException("Responsible user wasn't found.");
      }
    }

    if (updateOrderDto.recieverId) {
      const reciever = await this.recieverRepository.findRecieverById(
        updateOrderDto.recieverId,
      );
      if (!reciever) {
        throw new NotFoundException("Reciever wasn't found.");
      }
    }

    return await this.orderRepository.updateOrder(orderId, updateOrderDto);
  }

  async deleteOrder(companyId: string, orderId: string): Promise<void> {
    const order = await this.orderRepository.findOrderById(orderId);

    if (!order || order.company_id !== companyId) {
      throw new NotFoundException('Nothing to delete');
    }

    await this.orderRepository.deleteOrder(orderId);
  }
}
