import { Module } from '@nestjs/common';
import { SupplyChainController } from './supply-chain.controller';
import { SupplyChainService } from './supply-chain.service';
import { SupplyChainRepository } from './supply-chain.repository';

@Module({
  imports: [],
  controllers: [SupplyChainController],
  providers: [SupplyChainService, SupplyChainRepository],
  exports: [SupplyChainService, SupplyChainRepository],
})
export class SupplyChainModule {}
