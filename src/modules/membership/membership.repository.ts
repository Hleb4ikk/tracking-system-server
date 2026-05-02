import { Injectable } from '@nestjs/common';
import { IMembershipRepository } from 'src/interfaces/IMembershipRepository';
import { PostgresService } from '../database/postgres.service';
import { Membership } from 'src/types/Membership';

@Injectable()
export class MembershipRepository implements IMembershipRepository {
  constructor(private readonly postgresService: PostgresService) {}

  async deleteMembership(userId: string, companyId: string): Promise<void> {
    await this.postgresService.query(
      `DELETE FROM positions WHERE positions.user_id = $1 AND positions.company_id = $2;`,
      [userId, companyId],
    );
  }

  async findMembership(userId: string, companyId: string): Promise<Membership> {
    const membership = await this.postgresService.query<Membership>(
      `SELECT * FROM positions WHERE positions.user_id = $1 AND positions.company_id = $2;`,
      [userId, companyId],
    );
    return membership.rows[0];
  }
}
