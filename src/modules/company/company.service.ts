import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { CreateCompanyDto, UpdateCompanyDto } from 'src/schemas/companySchema';
import { Company } from 'src/types/Company';
import { User } from 'src/types/User';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async getCompanyById(company_id: string): Promise<Company> {
    const company = await this.companyRepository.findCompanyById(company_id);

    if (!company) {
      throw new NotFoundException("Company wasn't found");
    }

    return company;
  }

  async createCompany(user: User, createCompanyDto: CreateCompanyDto) {
    if (user.company_id) {
      throw new ConflictException(
        'One user can own or be a member of only one organization.',
      );
    }

    const company = await this.companyRepository.findByTitle(
      createCompanyDto.title,
    );

    if (company) {
      throw new ConflictException(
        'Organization with the same title already exists. Choose another',
      );
    }

    return await this.companyRepository.createCompany(
      user.id,
      createCompanyDto,
    );
  }

  async updateCompanyById(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
  ) {
    const existingCompany =
      await this.companyRepository.findCompanyById(companyId);

    if (!existingCompany) {
      throw new NotFoundException("Company wasn't found.");
    }
    if (updateCompanyDto.title) {
      const toBeConflictedCompany = await this.companyRepository.findByTitle(
        updateCompanyDto.title,
      );

      if (
        toBeConflictedCompany &&
        !(toBeConflictedCompany.id === existingCompany.id)
      ) {
        throw new ConflictException(
          'Company with the same title already exists. Choose another',
        );
      }
    }

    const companyFields = await this.companyRepository.updateCompanyById(
      companyId,
      updateCompanyDto,
    );
    return companyFields;
  }

  async deleteCompanyById(company_id: string) {
    if (!company_id) {
      throw new NotFoundException(
        "Company membership wasn't found. User must be a member of organization",
      );
    }

    const existingCompany =
      await this.companyRepository.findCompanyById(company_id);

    if (!existingCompany) {
      throw new NotFoundException("Company wasn't found.");
    }

    const company = await this.companyRepository.deleteCompanyById(
      existingCompany.id,
    );

    return company;
  }
}
