import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InvitationRepository } from './invitation.repository';
import { Invitation } from 'src/types/Invitation';
import { CompanyRepository } from '../company/company.repository';
import {
  CreateInvitationDto,
  InvitationFilters,
} from 'src/schemas/invitationSchema';
import { User } from 'src/types/User';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class InvitationService {
  private readonly logger = new Logger(InvitationService.name);

  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async findInvitations(
    page,
    limit,
    filters?: InvitationFilters,
  ): Promise<Invitation[]> {
    if (filters?.companyId) {
      const company = await this.companyRepository.findCompanyById(
        filters.companyId,
      );
      if (!company) {
        throw new NotFoundException("Company from filters wasn't found.");
      }
    }

    const result = await this.invitationRepository.findInvitations(
      limit,
      page,
      filters,
    );
    return result;
  }

  async createInvitation(
    companyId: string,
    userId: string,
    createInvitationDto: CreateInvitationDto,
  ): Promise<Invitation> {
    const company = await this.companyRepository.findCompanyById(companyId);

    if (!company) {
      throw new NotFoundException(
        "Company from invitation params wasn't found.",
      );
    }

    return await this.invitationRepository.createInvitation(
      companyId,
      userId,
      createInvitationDto,
    );
  }

  async deleteInvitation(
    companyId: string,
    invitationId: string,
  ): Promise<void> {
    const existingInvitation =
      await this.invitationRepository.findInvitationById(invitationId);

    if (!existingInvitation || existingInvitation.company_id !== companyId) {
      throw new NotFoundException('Nothing to delete');
    }
    await this.invitationRepository.deleteInvitation(invitationId);
  }

  async acceptInvitation(invitationId: string, user: User): Promise<void> {
    const existingInvitation =
      await this.invitationRepository.findInvitationById(invitationId);

    if (!existingInvitation) {
      throw new NotFoundException(
        'Invitation not found. Please contact your company responsible personal.',
      );
    }

    if (existingInvitation.reciever_email !== user.email) {
      throw new ForbiddenException();
    }

    const company = await this.companyRepository.findCompanyById(
      user.company_id!,
    );

    if (company) {
      throw new UnprocessableEntityException(
        "You can't accept invitation while don't leave your organization",
      );
    }

    await this.invitationRepository.acceptInvitation(invitationId, user.id);
  }
  @Cron('0 0 * * *')
  async scheduleDelete() {
    this.logger.log('Invitations days to delete were updated.');
    await this.invitationRepository.decrementAllActiveInvitations();
  }
}
