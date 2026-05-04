import {
  CreateInvitationDto,
  InvitationFilters,
} from 'src/schemas/invitationSchema';
import { Invitation } from 'src/types/Invitation';

export interface IInvitationRepository {
  createInvitation(
    companyId: string,
    userId: string,
    createInvitationDto: CreateInvitationDto,
  ): Promise<Invitation>;
  deleteInvitation(invitationId: string): Promise<void>;
  acceptInvitation(invitationId: string, userId: string);
  findInvitations(
    limit: number,
    page: number,
    filters?: InvitationFilters,
  ): Promise<Invitation[]>;
  findInvitationById(invitationId: string): Promise<Invitation>;
}
