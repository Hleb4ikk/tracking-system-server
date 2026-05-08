import { Injectable, NotFoundException } from '@nestjs/common';
import { RecieverRepository } from './reciever.repository';
import {
  CreateRecieverDto,
  RecieverFilters,
  UpdateRecieverDto,
} from 'src/schemas/recieverSchemas';
import { CompanyRepository } from '../company/company.repository';
import { Reciever } from 'src/types/Reciever';

@Injectable()
export class RecieverService {
  constructor(
    private readonly recieverRepository: RecieverRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async findRecievers(
    page: number,
    limit: number,
    filters?: RecieverFilters,
  ): Promise<Reciever[]> {
    if (filters?.companyId) {
      const company = await this.companyRepository.findCompanyById(
        filters.companyId,
      );
      if (!company) {
        throw new NotFoundException("Company from filters wasn't found.");
      }
    }
    return await this.recieverRepository.findRecievers(limit, page, filters);
  }

  async createReciever(
    companyId: string,
    createRecieverDto: CreateRecieverDto,
  ): Promise<Reciever> {
    const company = await this.companyRepository.findCompanyById(companyId);

    if (!company) {
      throw new NotFoundException(
        "User company wasn't found to create reciever.",
      );
    }

    return await this.recieverRepository.createReciever(
      companyId,
      createRecieverDto,
    );
  }

  async updateReciever(
    companyId: string,
    recieverId: string,
    updateRecieverDto: UpdateRecieverDto,
  ): Promise<Partial<Reciever>> {
    const reciever = await this.recieverRepository.findRecieverById(recieverId);

    if (!reciever || reciever.company_id !== companyId) {
      throw new NotFoundException("Reciever wasn't found.");
    }

    const updatedFields = await this.recieverRepository.updateReciever(
      recieverId,
      updateRecieverDto,
    );
    return updatedFields;
  }

  async deleteReciever(companyId: string, recieverId: string): Promise<void> {
    const reciever = await this.recieverRepository.findRecieverById(recieverId);

    if (!reciever || reciever.company_id !== companyId) {
      throw new NotFoundException('Nothing to delete');
    }

    await this.recieverRepository.deleteReciever(recieverId);
  }
}
