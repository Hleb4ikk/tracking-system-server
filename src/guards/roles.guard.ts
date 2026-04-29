import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CompanyRoles } from 'src/decorators/company-roles.decorator';
import { ROLES } from 'src/enums/roles';
import { RequestWithUser } from 'src/types/Request';
import { User } from 'src/types/User';
import { matchRole } from 'src/utils/matchRole';

@Injectable()
export class CompanyRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: ROLES[] | {} = this.reflector.get(
      CompanyRoles,
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user: User | undefined = request.user;

    if (!user) {
      throw new InternalServerErrorException(
        'RolesGuard must be used after AuthGuard',
      );
    }

    if (!user.role || !user.company_id) {
      throw new ForbiddenException(
        'User must be a member of a company to do this action',
      );
    }

    if (!Array.isArray(roles)) {
      return true;
    }

    return matchRole(roles, user.role);
  }
}
