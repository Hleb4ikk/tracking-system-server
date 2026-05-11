import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CargoRepository } from './cargo.repository';
import { CargoService } from './cargo.service';
import { CargoController } from './cargo.controller';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    DatabaseModule,
    CompanyModule,
    UserModule,
    VehicleModule,
    OrderModule,
  ],
  controllers: [CargoController],
  providers: [CargoRepository, CargoService],
  exports: [CargoRepository, CargoService],
})
export class CargoModule {}
