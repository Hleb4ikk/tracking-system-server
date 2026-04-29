import { ROLES } from 'src/enums/roles';

export function matchRole(requiredRoles: ROLES[], currentRole: ROLES) {
  return requiredRoles.includes(currentRole);
}
