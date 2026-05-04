import { Module } from '@nestjs/common';
import { SupplyChainController } from './supply-chain.controller';
import { SupplyChainService } from './supply-chain.service';
import { SupplyChainRepository } from './supply-chain.repository';
import { DatabaseModule } from '../database/database.module';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, CompanyModule, UserModule],
  controllers: [SupplyChainController],
  providers: [SupplyChainService, SupplyChainRepository],
  exports: [SupplyChainService, SupplyChainRepository],
})
export class SupplyChainModule {}
