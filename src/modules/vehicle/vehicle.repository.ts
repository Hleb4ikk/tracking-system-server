import { Injectable } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { IVehicleRepository } from 'src/interfaces/IVehicleRepository';
import { CreateVehicleDto, VehicleFilters } from 'src/schemas/vehicleSchemas';
import { Vehicle } from 'src/types/Vehicle';

@Injectable()
export class VehicleRepository implements IVehicleRepository {
  constructor(private readonly postgresService: PostgresService) {}

  async findVehicles(
    limit: number,
    page: number,
    filters?: VehicleFilters,
  ): Promise<Vehicle[]> {
    const title = filters?.title ? `%${filters.title}%` : '%';

    const result = await this.postgresService.query<Vehicle>(
      `SELECT * 
        FROM vehicles 
        WHERE company_id = COALESCE($1, company_id) 
        AND title ILIKE $2
        AND delivery_type = COALESCE($3, delivery_type)  
       ORDER BY id DESC
       LIMIT $4 OFFSET $5;
    `,
      [
        filters?.companyId,
        title,
        filters?.deliveryType,
        limit,
        limit * (page - 1),
      ],
    );
    return result.rows;
  }

  async findVehicleById(vehicleId: string): Promise<Vehicle> {
    const result = await this.postgresService.query<Vehicle>(
      `SELECT * 
        FROM vehicles 
        WHERE id = $1;
      `,
      [vehicleId],
    );
    return result.rows[0];
  }

  async createVehicle(
    companyId: string,
    createVehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    const result = await this.postgresService.query<Vehicle>(
      `INSERT INTO vehicles(title, delivery_type, company_id) VALUES($1, $2, $3) RETURNING *;`,
      [createVehicleDto.title, createVehicleDto.deliveryType, companyId],
    );
    return result.rows[0];
  }

  async deleteVehicle(vehicleId: string): Promise<void> {
    await this.postgresService.query<Vehicle>(
      `DELETE FROM vehicles WHERE id = $1`,
      [vehicleId],
    );
  }
}
