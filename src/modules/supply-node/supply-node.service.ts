import { Injectable, NotFoundException } from '@nestjs/common';
import { SupplyNodeRepository } from './supply-node.repository';
import {
  CreateSupplyNodeDto,
  SupplyNodeFilters,
  UpdateSupplyNodeDto,
} from 'src/schemas/supplyNodeSchemas';
import { CompanyRepository } from '../company/company.repository';
import { SupplyNode } from 'src/types/SupplyNode';

@Injectable()
export class SupplyNodeService {
  constructor(
    private readonly supplyNodeRepository: SupplyNodeRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async findSupplyNodes(
    page: number,
    limit: number,
    filters?: SupplyNodeFilters,
  ): Promise<SupplyNode[]> {
    if (filters?.companyId) {
      const company = await this.companyRepository.findCompanyById(
        filters.companyId,
      );
      if (!company) {
        throw new NotFoundException("Company from filters wasn't found.");
      }
    }
    return await this.supplyNodeRepository.findSupplyNodes(
      limit,
      page,
      filters,
    );
  }

  async createSupplyNode(
    companyId: string,
    createSupplyNodeDto: CreateSupplyNodeDto,
  ): Promise<SupplyNode> {
    const company = await this.companyRepository.findCompanyById(companyId);

    if (!company) {
      throw new NotFoundException(
        "User company wasn't found to create supply node.",
      );
    }

    return await this.supplyNodeRepository.createSupplyNode(
      companyId,
      createSupplyNodeDto,
    );
  }

  async updateSupplyNode(
    companyId: string,
    supplyNodeId: string,
    updateSupplyNodeDto: UpdateSupplyNodeDto,
  ): Promise<Partial<SupplyNode>> {
    const supplyNode =
      await this.supplyNodeRepository.findSupplyNodeById(supplyNodeId);

    if (!supplyNode || supplyNode.company_id !== companyId) {
      throw new NotFoundException("Supply node wasn't found.");
    }

    const updatedFields = await this.supplyNodeRepository.updateSupplyNode(
      supplyNodeId,
      updateSupplyNodeDto,
    );
    return updatedFields;
  }

  async deleteSupplyNode(
    companyId: string,
    supplyNodeId: string,
  ): Promise<void> {
    const supplyNode =
      await this.supplyNodeRepository.findSupplyNodeById(supplyNodeId);

    if (!supplyNode || supplyNode.company_id !== companyId) {
      throw new NotFoundException('Nothing to delete');
    }

    await this.supplyNodeRepository.deleteSupplyNode(supplyNodeId);
  }
}
