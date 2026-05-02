import { ROLES } from 'src/enums/roles';

export interface Membership {
  company_id: string;
  user_id: string;
  role: ROLES;
}
