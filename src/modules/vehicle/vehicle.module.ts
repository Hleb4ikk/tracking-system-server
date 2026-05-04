import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { VehicleRepository } from './vehicle.repository';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, CompanyModule, UserModule],
  controllers: [VehicleController],
  providers: [VehicleRepository, VehicleService],
  exports: [VehicleRepository, VehicleService],
})
export class VehicleModule {}
