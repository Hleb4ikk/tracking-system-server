import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SupplyNodeRepository } from './supply-node.repository';
import { SupplyNodeService } from './supply-node.service';
import { SupplyNodeController } from './supply-node.controller';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, CompanyModule, UserModule],
  controllers: [SupplyNodeController],
  providers: [SupplyNodeRepository, SupplyNodeService],
  exports: [SupplyNodeRepository, SupplyNodeService],
})
export class SupplyNodeModule {}
