import { Injectable } from '@nestjs/common';
import { ISupplyChainRepository } from 'src/interfaces/ISupplyChainRepository';
import {
  CreateSupplyChainDto,
  SupplyChainFilters,
} from 'src/schemas/supplyChainSchemas';
import { SupplyChain } from 'src/types/SupplyChain';
import { PostgresService } from '../database/postgres.service';

@Injectable()
export class SupplyChainRepository implements ISupplyChainRepository {
  constructor(private readonly postgresService: PostgresService) {}

  async findSupplyChains(
    limit: number,
    page: number,
    supplyChainFilters?: SupplyChainFilters,
  ): Promise<SupplyChain[]> {
    const title = supplyChainFilters?.title
      ? `%${supplyChainFilters.title}%`
      : '%';

    const result = await this.postgresService.query<SupplyChain>(
      `SELECT * 
        FROM supply_chains 
        WHERE title ILIKE $1
        AND company_id = COALESCE($2, company_id)  
       ORDER BY id DESC
       LIMIT $3 OFFSET $4;
       `,
      [title, supplyChainFilters?.companyId, limit, limit * (page - 1)],
    );

    return result.rows;
  }

  async findSupplyChainById(supplyChainId: string): Promise<SupplyChain> {
    const result = await this.postgresService.query<SupplyChain>(
      `SELECT * FROM supply_chains WHERE supply_chains.id = $1;`,
      [supplyChainId],
    );

    return result.rows[0] ?? null;
  }

  async createSupplyChain(
    companyId: string,
    createSupplyChainDto: CreateSupplyChainDto,
  ): Promise<SupplyChain> {
    const result = await this.postgresService.query<SupplyChain>(
      `INSERT INTO supply_chains(title, description, company_id) VALUES ($1, $2, $3) RETURNING *;`,
      [
        createSupplyChainDto.title,
        createSupplyChainDto.description ?? null,
        companyId,
      ],
    );
    return result.rows[0];
  }

  async deleteSupplyChain(supplyChainId: string): Promise<void> {
    await this.postgresService.query(
      `DELETE FROM supply_chains WHERE id = $1;`,
      [supplyChainId],
    );
  }
}
