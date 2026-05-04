import {
  CreateSupplyNodeDto,
  SupplyNodeFilters,
  UpdateSupplyNodeDto,
} from 'src/schemas/supplyNodeSchemas';
import { SupplyNode } from 'src/types/SupplyNode';

export interface ISupplyNodeRepository {
  findSupplyNodes(
    limit: number,
    page: number,
    filters?: SupplyNodeFilters,
  ): Promise<SupplyNode[]>;

  findSupplyNodeById(supplyNodeId: string): Promise<SupplyNode>;

  createSupplyNode(
    companyId: string,
    createSupplyNodeDto: CreateSupplyNodeDto,
  ): Promise<SupplyNode>;

  updateSupplyNode(
    supplyNodeId: string,
    updateSupplyNodeDto: UpdateSupplyNodeDto,
  ): Promise<Partial<SupplyNode>>;

  deleteSupplyNode(supplyNodeId: string): Promise<void>;
}
