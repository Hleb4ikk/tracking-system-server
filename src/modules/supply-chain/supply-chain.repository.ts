import { BadRequestException, Injectable } from '@nestjs/common';
import { ISupplyChainRepository } from 'src/interfaces/ISupplyChainRepository';
import {
  CreateSupplyChainDto,
  SupplyChainFilters,
  UpdateSupplyChainDto,
} from 'src/schemas/supplyChainSchemas';
import {
  SupplyChain,
  SupplyChainWithConnections,
  SupplyChainWithGraph,
} from 'src/types/SupplyChain';
import { PostgresService } from '../database/postgres.service';
import { SupplyGraph } from 'src/classes/SupplyChainGraph';
import { SupplyNodeConnection } from 'src/types/SupplyNodeConnection';

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

  async findSupplyChainWithConnectionsById(
    supplyChainId: string,
  ): Promise<SupplyChainWithGraph | null> {
    const result = await this.postgresService.query<SupplyChainWithConnections>(
      `
      SELECT 
      sc.*, 
      COALESCE(
          json_agg(
              json_build_object(
                  'id', snc.id,
                  'start_node', to_jsonb(sn_start),
                  'destination_node', to_jsonb(sn_destination)
              )
          ) FILTER (WHERE snc.id IS NOT NULL), '[]') AS supply_node_connections
      FROM supply_chains sc
      LEFT JOIN supply_node_connections snc ON sc.id = snc.supply_chain_id
      LEFT JOIN supply_nodes sn_start ON snc.start_node_id = sn_start.id
      LEFT JOIN supply_nodes sn_destination ON snc.destination_node_id = sn_destination.id
      WHERE sc.id = $1
      GROUP BY sc.id;
      `,
      [supplyChainId],
    );

    if (!result.rows[0]) {
      return null;
    }

    const { supply_node_connections, ...supplyChain } = result.rows[0];

    return {
      ...supplyChain,
      supplyGraph: new SupplyGraph(supply_node_connections),
    };
  }

  async createSupplyChain(
    companyId: string,
    createSupplyChainDto: CreateSupplyChainDto,
  ): Promise<SupplyChainWithGraph> {
    try {
      await this.postgresService.query('BEGIN;');

      const result = await this.postgresService.query<SupplyChain>(
        `INSERT INTO supply_chains(title, description, company_id) VALUES ($1, $2, $3) RETURNING *;`,
        [
          createSupplyChainDto.title,
          createSupplyChainDto.description ?? null,
          companyId,
        ],
      );

      const supplyChain = result.rows[0];

      let connections: SupplyNodeConnection[] = [];

      if (
        createSupplyChainDto.supply_node_connections &&
        createSupplyChainDto.supply_node_connections.length > 0
      ) {
        connections = await this.createConnections(
          supplyChain.id,
          createSupplyChainDto.supply_node_connections,
        );
      }
      await this.postgresService.query('COMMIT;');
      const supplyChainWithGraph: SupplyChainWithGraph = {
        ...supplyChain,
        supplyGraph: new SupplyGraph(connections),
      };

      return supplyChainWithGraph;
    } catch (error) {
      await this.postgresService.query('ROLLBACK;');
      throw error;
    }
  }

  async updateSupplyChain(
    supplyChainId: string,
    updateSupplyChainDto: UpdateSupplyChainDto,
  ): Promise<Partial<SupplyChainWithGraph>> {
    try {
      await this.postgresService.query('BEGIN;');

      await this.postgresService.query(
        `UPDATE supply_chains SET 
            title = COALESCE($1, title), 
            description = COALESCE($2, description)
            WHERE id = $3;
            `,
        [
          updateSupplyChainDto.title ?? null,
          updateSupplyChainDto.description ?? null,
          supplyChainId,
        ],
      );
      let connections: SupplyNodeConnection[] = [];
      if (updateSupplyChainDto.supply_node_connections !== undefined) {
        await this.postgresService.query(
          `DELETE FROM supply_node_connections WHERE supply_chain_id = $1;`,
          [supplyChainId],
        );

        if (
          updateSupplyChainDto.supply_node_connections &&
          updateSupplyChainDto.supply_node_connections.length > 0
        ) {
          connections = await this.createConnections(
            supplyChainId,
            updateSupplyChainDto.supply_node_connections,
          );
        }
      }

      await this.postgresService.query('COMMIT;');
      const { supply_node_connections: _, ...supplyChain } =
        updateSupplyChainDto;
      return {
        ...supplyChain,
        supplyGraph: connections ? new SupplyGraph(connections) : undefined,
      };
    } catch (error) {
      await this.postgresService.query('ROLLBACK;');
      throw error;
    }
  }

  private async createConnections(
    supplyChainId: string,
    connections: {
      startNodeId: string;
      destinationNodeId: string;
      distance: number;
    }[],
  ): Promise<SupplyNodeConnection[]> {
    const seen = new Set();
    for (const conn of connections) {
      const key = `${conn.startNodeId} -> ${conn.destinationNodeId}`;
      if (seen.has(key)) {
        throw new BadRequestException(
          `Duplicate connection in request: ${key}`,
        );
      }
      seen.add(key);
    }

    const values: string[] = [];
    const params: (string | number)[] = [];
    let paramIndex = 1;

    for (const connection of connections) {
      values.push(
        `($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`,
      );
      params.push(
        supplyChainId,
        connection.startNodeId,
        connection.destinationNodeId,
        connection.distance,
      );
      paramIndex += 4;
    }

    const result = await this.postgresService.query<SupplyNodeConnection>(
      `WITH inserted_rows AS (
        INSERT INTO supply_node_connections (supply_chain_id, start_node_id, destination_node_id, distance)
        VALUES ${values.join(', ')}
        RETURNING *
       )
       SELECT 
        ir.*, 
        to_jsonb(sn_start) AS start_node, 
        to_jsonb(sn_destination) AS destination_node
       FROM inserted_rows ir
       LEFT JOIN supply_nodes sn_start ON ir.start_node_id = sn_start.id
       LEFT JOIN supply_nodes sn_destination ON ir.destination_node_id = sn_destination.id;`,
      params,
    );
    return result.rows;
  }

  async deleteSupplyChain(supplyChainId: string): Promise<void> {
    await this.postgresService.query(
      `DELETE FROM supply_chains WHERE id = $1;`,
      [supplyChainId],
    );
  }
}
