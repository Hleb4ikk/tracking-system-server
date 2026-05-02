import {
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CompanyRoles } from 'src/decorators/company-roles.decorator';
import { CompanyRolesGuard } from 'src/guards/roles.guard';
import { ROLES } from 'src/enums/roles';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { type User } from 'src/types/User';

@Controller('/membership')
@UseGuards(AuthGuard, CompanyRolesGuard)
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}
  @Delete('/me')
  @CompanyRoles()
  async deleteMyMembership(@CurrentUser() user: User) {
    await this.membershipService.deleteMembership(user.id, user.company_id!);
    return { message: 'Successfully left from the organization' };
  }

  @Delete('/:user_id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async deleteMembership(
    @CurrentUser() user: User,
    @Param('user_id', ParseUUIDPipe) userId: string,
  ) {
    await this.membershipService.deleteMembership(userId, user.company_id!);
    return { message: 'User membership was stopped.' };
  }
}
