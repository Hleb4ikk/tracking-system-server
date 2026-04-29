import { Reflector } from '@nestjs/core';
import { ROLES } from 'src/enums/roles';

export const CompanyRoles = Reflector.createDecorator<ROLES[]>();
