import { CreateCompanyDto, UpdateCompanyDto } from 'src/schemas/companySchema';
import { Company } from 'src/types/Company';

export interface ICompanyRepository {
  /* Will return company or null if not found */
  findCompanyById(id: string): Promise<Company | null>;

  findByTitle(title: string): Promise<Company | null>;

  createCompany(ownerId: string, company: CreateCompanyDto): Promise<Company>;

  /* Will return only changed data fields */
  updateCompanyById(
    companyId: string,
    company: UpdateCompanyDto,
  ): Promise<Partial<Company>>;

  deleteCompanyById(user_id: string, company_id: string): Promise<void>;
}
