import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompanyRolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { OrderService } from './order.service';
import { CompanyRoles } from 'src/decorators/company-roles.decorator';
import { ROLES } from 'src/enums/roles';
import {
  createOrderSchema,
  orderQuerySchema,
  updateOrderSchema,
  type CreateOrderDto,
  type OrderQuery,
  type UpdateOrderDto,
} from 'src/schemas/orderSchemas';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('/orders')
@UseGuards(AuthGuard, CompanyRolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN, ROLES.EXPEDITOR])
  async findOrders(
    @Query(new ZodValidationPipe(orderQuerySchema))
    orderQuery: OrderQuery,
    @CurrentUser('company_id')
    companyId: string,
  ) {
    const { page, ...orderFilters } = orderQuery;

    const orders = await this.orderService.findOrders(page, 20, {
      ...orderFilters,
      companyId,
    });
    return orders;
  }

  @Get(':id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN, ROLES.EXPEDITOR])
  async findOrderById(
    @Param('id', ParseUUIDPipe) orderId: string,
    @CurrentUser('company_id') companyId: string,
  ) {
    const order = await this.orderService.findOrderById(companyId, orderId);
    return { order };
  }

  @Post()
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async createOrder(
    @CurrentUser('company_id') companyId: string,
    @Body(new ZodValidationPipe(createOrderSchema))
    createOrderDto: CreateOrderDto,
  ) {
    const order = await this.orderService.createOrder(
      companyId,
      createOrderDto,
    );
    return { message: 'Order created successfully!', order };
  }

  @Patch(':id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN, ROLES.EXPEDITOR])
  async updateOrder(
    @CurrentUser('company_id') companyId: string,
    @Param('id', ParseUUIDPipe) orderId: string,
    @Body(new ZodValidationPipe(updateOrderSchema))
    updateOrderDto: UpdateOrderDto,
  ) {
    const updatedFields = await this.orderService.updateOrder(
      companyId,
      orderId,
      updateOrderDto,
    );
    return { message: 'Order was updated successfully!', updatedFields };
  }

  @Delete(':id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async deleteOrder(
    @CurrentUser('company_id') companyId: string,
    @Param('id', ParseUUIDPipe) orderId: string,
  ) {
    await this.orderService.deleteOrder(companyId, orderId);
    return { message: 'Order was deleted successfully!' };
  }
}
