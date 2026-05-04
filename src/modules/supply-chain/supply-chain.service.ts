import { Injectable, NotFoundException } from '@nestjs/common';
import { SupplyChainRepository } from './supply-chain.repository';
import { CompanyRepository } from '../company/company.repository';
import {
  CreateSupplyChainDto,
  SupplyChainFilters,
} from 'src/schemas/supplyChainSchemas';
import { SupplyChain } from 'src/types/SupplyChain';

@Injectable()
export class SupplyChainService {
  constructor(
    private readonly supplyChainRepository: SupplyChainRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async findSupplyChains(
    page: number,
    limit: number,
    supplyChainFilters?: SupplyChainFilters,
  ): Promise<SupplyChain[]> {
    if (supplyChainFilters?.companyId) {
      const company = await this.companyRepository.findCompanyById(
        supplyChainFilters.companyId,
      );
      if (!company) {
        throw new NotFoundException("Company from filters wasn't found.");
      }
    }
    return await this.supplyChainRepository.findSupplyChains(
      limit,
      page,
      supplyChainFilters,
    );
  }

  async createSupplyChain(
    companyId: string,
    createSupplyChainDto: CreateSupplyChainDto,
  ): Promise<SupplyChain> {
    const company = await this.companyRepository.findCompanyById(companyId);

    if (!company) {
      throw new NotFoundException(
        "User company wasn't found to create vehicle.",
      );
    }

    return await this.supplyChainRepository.createSupplyChain(
      companyId,
      createSupplyChainDto,
    );
  }

  async deleteSupplyChain(
    companyId: string,
    supplyChainId: string,
  ): Promise<void> {
    const supplyChain =
      await this.supplyChainRepository.findSupplyChainById(supplyChainId);

    if (!supplyChain || supplyChain.company_id !== companyId) {
      throw new NotFoundException('Nothing to delete');
    }

    await this.supplyChainRepository.deleteSupplyChain(supplyChainId);
  }
}
