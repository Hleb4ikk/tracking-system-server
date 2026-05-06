import {
  CreateSupplyChainDto,
  SupplyChainFilters,
  UpdateSupplyChainDto,
} from 'src/schemas/supplyChainSchemas';
import { SupplyChain, SupplyChainWithGraph } from 'src/types/SupplyChain';

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
  ): Promise<SupplyChainWithGraph>;

  updateSupplyChain(
    supplyChainId: string,
    updateSupplyChainDto: UpdateSupplyChainDto,
  ): Promise<Partial<SupplyChainWithGraph>>;

  deleteSupplyChain(supplyChainId: string): Promise<void>;
}
