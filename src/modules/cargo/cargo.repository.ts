import { Injectable } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { ICargoRepository } from 'src/interfaces/ICargoRepository';
import {
  CreateCargoDto,
  CargoFilters,
  UpdateCargoDto,
} from 'src/schemas/cargoSchemas';
import { Cargo } from 'src/types/Cargo';

@Injectable()
export class CargoRepository implements ICargoRepository {
  constructor(private readonly postgresService: PostgresService) {}

  async findCargos(
    limit: number,
    page: number,
    filters?: CargoFilters,
  ): Promise<Cargo[]> {
    const title = filters?.title ? `%${filters.title}%` : '%';
    const status = filters?.status ?? null;

    const result = await this.postgresService.query<Cargo>(
      `SELECT * 
        FROM cargos 
        WHERE company_id = COALESCE($1, company_id)
        AND title ILIKE $2
        AND (status = $3 OR $3 IS NULL)
        AND supply_node_connection_id = COALESCE($4, supply_node_connection_id)
        AND (vehicle_id IS NULL OR vehicle_id = COALESCE($5, vehicle_id))
        AND (order_id IS NULL OR order_id = COALESCE($6, order_id))
        AND responsible_id = COALESCE($7, responsible_id)
       ORDER BY created_at DESC
       LIMIT $8 OFFSET $9;
      `,
      [
        filters?.companyId,
        title,
        status,
        filters?.supplyNodeConnectionId,
        filters?.vehicleId,
        filters?.orderId,
        filters?.responsibleId,
        limit,
        limit * (page - 1),
      ],
    );
    return result.rows;
  }

  async findCargoById(cargoId: string): Promise<Cargo> {
    const result = await this.postgresService.query<Cargo>(
      `SELECT * FROM cargos WHERE id = $1;`,
      [cargoId],
    );
    return result.rows[0];
  }

  async createCargo(
    companyId: string,
    createCargoDto: CreateCargoDto,
  ): Promise<Cargo> {
    const result = await this.postgresService.query<Cargo>(
      `INSERT INTO cargos(title, description, supply_node_connection_id, status, vehicle_id, order_id, responsible_id, company_id) 
       VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [
        createCargoDto.title,
        createCargoDto.description,
        createCargoDto.supplyNodeConnectionId,
        createCargoDto.status ?? 'assembly',
        createCargoDto.vehicleId ?? null,
        createCargoDto.orderId ?? null,
        createCargoDto.responsibleId,
        companyId,
      ],
    );
    return result.rows[0];
  }

  async updateCargo(
    cargoId: string,
    updateCargoDto: UpdateCargoDto,
  ): Promise<Partial<Cargo>> {
    await this.postgresService.query<Cargo>(
      `UPDATE cargos SET 
            title = COALESCE($1, title), 
            description = COALESCE($2, description),
            supply_node_connection_id = COALESCE($3, supply_node_connection_id),
            status = COALESCE($4, status),
            vehicle_id = $5,
            order_id = $6,
            responsible_id = COALESCE($7, responsible_id)
            WHERE id = $8;
            `,
      [
        updateCargoDto.title ?? null,
        updateCargoDto.description ?? null,
        updateCargoDto.supplyNodeConnectionId ?? null,
        updateCargoDto.status ?? null,
        updateCargoDto.vehicleId === undefined
          ? null
          : updateCargoDto.vehicleId,
        updateCargoDto.orderId === undefined ? null : updateCargoDto.orderId,
        updateCargoDto.responsibleId ?? null,
        cargoId,
      ],
    );
    return updateCargoDto;
  }

  async deleteCargo(cargoId: string): Promise<void> {
    await this.postgresService.query<Cargo>(
      `DELETE FROM cargos WHERE id = $1`,
      [cargoId],
    );
  }
}
