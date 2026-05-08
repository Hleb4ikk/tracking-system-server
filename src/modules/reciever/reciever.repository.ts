import { Injectable } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { IRecieverRepository } from 'src/interfaces/IRecieverRepository';
import {
  CreateRecieverDto,
  RecieverFilters,
  UpdateRecieverDto,
} from 'src/schemas/recieverSchemas';
import { Reciever } from 'src/types/Reciever';

@Injectable()
export class RecieverRepository implements IRecieverRepository {
  constructor(private readonly postgresService: PostgresService) {}

  async findRecievers(
    limit: number,
    page: number,
    filters?: RecieverFilters,
  ): Promise<Reciever[]> {
    const name = filters?.name ? `%${filters.name}%` : '%';
    const surname = filters?.surname ? `%${filters.surname}%` : '%';
    const email = filters?.email ? `%${filters.email}%` : '%';
    const phone = filters?.phone ? `%${filters.phone}%` : '%';

    const result = await this.postgresService.query<Reciever>(
      `SELECT * 
        FROM recievers 
        WHERE company_id = COALESCE($1, company_id) 
        AND name ILIKE $2
        AND surname ILIKE $3
        AND email ILIKE $4
        AND phone ILIKE $5
       ORDER BY id DESC
       LIMIT $6 OFFSET $7;
    `,
      [
        filters?.companyId,
        name,
        surname,
        email,
        phone,
        limit,
        limit * (page - 1),
      ],
    );
    return result.rows;
  }

  async findRecieverById(recieverId: string): Promise<Reciever> {
    const result = await this.postgresService.query<Reciever>(
      `SELECT * 
        FROM recievers 
        WHERE id = $1;
      `,
      [recieverId],
    );
    return result.rows[0];
  }

  async createReciever(
    companyId: string,
    createRecieverDto: CreateRecieverDto,
  ): Promise<Reciever> {
    const result = await this.postgresService.query<Reciever>(
      `INSERT INTO recievers(name, surname, email, phone, company_id) 
       VALUES($1, $2, $3, $4, $5) RETURNING *;`,
      [
        createRecieverDto.name,
        createRecieverDto.surname,
        createRecieverDto.email,
        createRecieverDto.phone,
        companyId,
      ],
    );
    return result.rows[0];
  }

  async updateReciever(
    recieverId: string,
    updateRecieverDto: UpdateRecieverDto,
  ): Promise<Partial<Reciever>> {
    await this.postgresService.query<Reciever>(
      `UPDATE recievers SET 
            name = COALESCE($1, name), 
            surname = COALESCE($2, surname),
            email = COALESCE($3, email),
            phone = COALESCE($4, phone)
            WHERE id = $5;
            `,
      [
        updateRecieverDto.name ?? null,
        updateRecieverDto.surname ?? null,
        updateRecieverDto.email ?? null,
        updateRecieverDto.phone ?? null,
        recieverId,
      ],
    );
    return updateRecieverDto;
  }

  async deleteReciever(recieverId: string): Promise<void> {
    await this.postgresService.query<Reciever>(
      `DELETE FROM recievers WHERE id = $1`,
      [recieverId],
    );
  }
}
