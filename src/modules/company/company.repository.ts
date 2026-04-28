import { Injectable } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { ICompanyRepository } from 'src/interfaces/ICompanyRepository';
import { Company } from 'src/types/Company';
import { CreateCompanyDto, UpdateCompanyDto } from 'src/schemas/companySchema';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(private readonly postgresService: PostgresService) {}

  async findCompanyById(id: string): Promise<Company | null> {
    const result = await this.postgresService.query<Company>(
      `SELECT * FROM companies WHERE companies.id = $1;`,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async findByTitle(title: string): Promise<Company | null> {
    const result = await this.postgresService.query<Company>(
      `SELECT * FROM companies WHERE companies.title = $1;`,
      [title],
    );

    return result.rows[0] ?? null;
  }

  async createCompany(
    ownerId: string,
    createCompanyDto: CreateCompanyDto,
  ): Promise<Company> {
    try {
      await this.postgresService.query('BEGIN;');

      const result = await this.postgresService.query<Company>(
        `INSERT INTO companies (title, description, owner_id) VALUES ($1, $2, $3) RETURNING *;`,
        [createCompanyDto.title, createCompanyDto.description ?? null, ownerId],
      );

      const companyId = result.rows[0].id;

      await this.postgresService.query(
        'UPDATE users SET company_id = $1 WHERE id = $2',
        [companyId, ownerId],
      );

      await this.postgresService.query('COMMIT;');

      return result.rows[0];
    } catch (error) {
      await this.postgresService.query('ROLLBACK;');

      throw error;
    }
  }
  async updateCompanyById(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Partial<Company>> {
    await this.postgresService.query<Company>(
      `UPDATE companies SET 
            title = COALESCE($1, title), 
            description = COALESCE($2, description),
            owner_id = COALESCE($3, owner_id)
            WHERE id = $4;
            `,
      [
        updateCompanyDto.title ?? null,
        updateCompanyDto.description ?? null,
        updateCompanyDto.ownerId ?? null,
        companyId,
      ],
    );
    return updateCompanyDto;
  }
  async deleteCompanyById(company_id: string): Promise<void> {
    await this.postgresService.query<Company>(
      `DELETE FROM companies WHERE id = $1;`,
      [company_id],
    );
  }
}
