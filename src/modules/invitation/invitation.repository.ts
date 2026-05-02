import { Injectable } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { IInvitationRepository } from 'src/interfaces/IInvitationRepository';
import {
  CreateInvitationDto,
  InvitationFilters,
} from 'src/schemas/invitationSchema';
import { Invitation } from 'src/types/Invitation';

@Injectable()
export class InvitationRepository implements IInvitationRepository {
  constructor(private readonly postgresService: PostgresService) {}

  async createInvitation(
    companyId: string,
    userId: string,
    createInvitationDto: CreateInvitationDto,
  ): Promise<Invitation> {
    const result = await this.postgresService.query<Invitation>(
      'INSERT INTO invitations (company_id, created_by, reciever_email, role, days_to_delete) VALUES ($1, $2, $3, $4, COALESCE($5, 1)) RETURNING *;',
      [
        companyId,
        userId,
        createInvitationDto.recieverEmail,
        createInvitationDto.role,
        createInvitationDto.daysToDelete,
      ],
    );
    return result.rows[0];
  }

  async deleteInvitation(invitationId: string): Promise<void> {
    await this.postgresService.query('DELETE FROM invitations WHERE id = $1;', [
      invitationId,
    ]);
  }

  async acceptInvitation(invitationId: string, userId: string) {
    try {
      await this.postgresService.query('BEGIN;');

      const result = await this.postgresService.query<Invitation>(
        'DELETE FROM invitations WHERE id = $1 RETURNING *;',
        [invitationId],
      );
      const invitation = result.rows[0];

      await this.postgresService.query(
        `INSERT INTO positions(company_id, user_id, role) VALUES($1, $2, $3);`,
        [invitation.company_id, userId, invitation.role],
      );
      await this.postgresService.query('COMMIT;');
    } catch (error) {
      await this.postgresService.query('ROLLBACK;');
      throw error;
    }
  }

  async findInvitations(
    limit: number,
    page: number,
    filters?: InvitationFilters,
  ): Promise<Invitation[]> {
    const email = filters?.email ? `%${filters.email}%` : '%';

    const result = await this.postgresService.query<Invitation>(
      `
    SELECT * 
    FROM invitations 
      WHERE company_id = COALESCE($1, company_id) 
      AND created_by = COALESCE($2, created_by)  
      AND role = COALESCE($3, role)  
      AND reciever_email ILIKE $4
    ORDER BY id DESC
    LIMIT $5 OFFSET $6;
    `,
      [
        filters?.companyId,
        filters?.createdBy,
        filters?.role,
        email,
        limit,
        limit * (page - 1),
      ],
    );

    return result.rows;
  }

  async findInvitationById(invitationId: string): Promise<Invitation> {
    const result = await this.postgresService.query<Invitation>(
      `SELECT * FROM invitations WHERE id = $1;`,
      [invitationId],
    );

    return result.rows[0];
  }
  async decrementAllActiveInvitations(): Promise<void> {
    await this.postgresService.query(
      `UPDATE invitations SET days_to_delete = days_to_delete - 1 WHERE days_to_delete >= 1;`,
    );
  }
}
