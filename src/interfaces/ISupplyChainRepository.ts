import {
  CreateSupplyChainDto,
  SupplyChainFilters,
} from 'src/schemas/supplyChainSchemas';
import { SupplyChain } from 'src/types/SupplyChain';

export interface ISupplyChainRepository {
  findSupplyChains(
    limit: number,
    page: number,
    supplyChainFilters: SupplyChainFilters,
  ): Promise<SupplyChain[]>;

  findSupplyChainById(supplyChainId: string): Promise<SupplyChain>;

  createSupplyChain(
    companyId: string,
    createSupplyChainDto: CreateSupplyChainDto,
  ): Promise<SupplyChain>;

  deleteSupplyChain(supplyChainId: string): Promise<void>;
}
