import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompanyRolesGuard } from 'src/guards/roles.guard';
import { InvitationService } from './invitation.service';
import { CompanyRoles } from 'src/decorators/company-roles.decorator';
import { ROLES } from 'src/enums/roles';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  type CreateInvitationDto,
  createInvitationSchema,
  type InvitationQuery,
  invitationQuerySchema,
} from 'src/schemas/invitationSchema';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { type User } from 'src/types/User';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('/invitations')
@UseGuards(AuthGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get()
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  @UseGuards(CompanyRolesGuard)
  async findCompanyInvitations(
    @Query(new ZodValidationPipe(invitationQuerySchema))
    invitationQuery: InvitationQuery,
    @CurrentUser('company_id')
    companyId: string,
  ) {
    const { page, ...invitationFilters } = invitationQuery;

    const invitations = await this.invitationService.findInvitations(page, 20, {
      ...invitationFilters,
      companyId,
    });
    return invitations;
  }

  @Post()
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  @UseGuards(CompanyRolesGuard)
  async createInvitation(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(createInvitationSchema))
    createInvitationDto: CreateInvitationDto,
  ) {
    const invitation = await this.invitationService.createInvitation(
      user.company_id!,
      user.id,
      createInvitationDto,
    );

    return { message: 'Invitation successfully created!', invitation };
  }

  @Delete('/:id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  @UseGuards(CompanyRolesGuard)
  async deleteInvitation(
    @CurrentUser('company_id') companyId: string,
    @Param('id', ParseUUIDPipe) invitationId: string,
  ) {
    await this.invitationService.deleteInvitation(companyId, invitationId);
    return { message: 'Invitation successfully deleted!' };
  }

  @Patch('/:id/accept')
  async acceptInvitation(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) invitationId: string,
  ) {
    await this.invitationService.acceptInvitation(invitationId, user);
    return { message: 'Invitation successfully accepted!' };
  }
}
