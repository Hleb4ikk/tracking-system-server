import { Injectable } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { ISupplyNodeRepository } from 'src/interfaces/ISupplyNodeRepository';
import {
  CreateSupplyNodeDto,
  SupplyNodeFilters,
  UpdateSupplyNodeDto,
} from 'src/schemas/supplyNodeSchemas';
import { SupplyNode } from 'src/types/SupplyNode';

@Injectable()
export class SupplyNodeRepository implements ISupplyNodeRepository {
  constructor(private readonly postgresService: PostgresService) {}

  async findSupplyNodes(
    limit: number,
    page: number,
    filters?: SupplyNodeFilters,
  ): Promise<SupplyNode[]> {
    const title = filters?.title ? `%${filters.title}%` : '%';
    const country = filters?.country ?? null;
    const zip = filters?.zip ? `%${filters.zip}%` : '%';
    const region = filters?.region ? `%${filters.region}%` : '%';
    const city = filters?.city ? `%${filters.city}%` : '%';
    const address_line = filters?.address_line
      ? `%${filters.address_line}%`
      : '%';

    const result = await this.postgresService.query<SupplyNode>(
      `SELECT * 
        FROM supply_nodes 
        WHERE company_id = COALESCE($1, company_id) 
        AND title ILIKE $2
        AND (country = $3 OR $3 IS NULL)
        AND zip ILIKE $4
        AND region ILIKE $5
        AND city ILIKE $6
        AND address_line ILIKE $7
       ORDER BY id DESC
       LIMIT $8 OFFSET $9;
    `,
      [
        filters?.companyId,
        title,
        country,
        zip,
        region,
        city,
        address_line,
        limit,
        limit * (page - 1),
      ],
    );
    return result.rows;
  }

  async findSupplyNodeById(supplyNodeId: string): Promise<SupplyNode> {
    const result = await this.postgresService.query<SupplyNode>(
      `SELECT * 
        FROM supply_nodes 
        WHERE id = $1;
      `,
      [supplyNodeId],
    );
    return result.rows[0];
  }

  async createSupplyNode(
    companyId: string,
    createSupplyNodeDto: CreateSupplyNodeDto,
  ): Promise<SupplyNode> {
    const result = await this.postgresService.query<SupplyNode>(
      `INSERT INTO supply_nodes(title, description, country, zip, region, city, address_line, company_id) 
       VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [
        createSupplyNodeDto.title,
        createSupplyNodeDto.description ?? null,
        createSupplyNodeDto.country,
        createSupplyNodeDto.zip,
        createSupplyNodeDto.region,
        createSupplyNodeDto.city,
        createSupplyNodeDto.address_line,
        companyId,
      ],
    );
    return result.rows[0];
  }

  async updateSupplyNode(
    supplyNodeId: string,
    updateSupplyNodeDto: UpdateSupplyNodeDto,
  ): Promise<Partial<SupplyNode>> {
    await this.postgresService.query<SupplyNode>(
      `UPDATE supply_nodes SET 
            title = COALESCE($1, title), 
            description = COALESCE($2, description),
            country = COALESCE($3, country),
            zip = COALESCE($4, zip),
            region = COALESCE($5, region),
            city = COALESCE($6, city),
            address_line = COALESCE($7, address_line)
            WHERE id = $8;
            `,
      [
        updateSupplyNodeDto.title ?? null,
        updateSupplyNodeDto.description ?? null,
        updateSupplyNodeDto.country ?? null,
        updateSupplyNodeDto.zip ?? null,
        updateSupplyNodeDto.region ?? null,
        updateSupplyNodeDto.city ?? null,
        updateSupplyNodeDto.address_line ?? null,
        supplyNodeId,
      ],
    );
    return updateSupplyNodeDto;
  }

  async deleteSupplyNode(supplyNodeId: string): Promise<void> {
    await this.postgresService.query<SupplyNode>(
      `DELETE FROM supply_nodes WHERE id = $1`,
      [supplyNodeId],
    );
  }
}
