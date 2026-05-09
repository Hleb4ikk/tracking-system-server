import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { RecieverModule } from '../reciever/reciever.module';

@Module({
  imports: [DatabaseModule, CompanyModule, UserModule, RecieverModule],
  controllers: [OrderController],
  providers: [OrderRepository, OrderService],
  exports: [OrderRepository, OrderService],
})
export class OrderModule {}
