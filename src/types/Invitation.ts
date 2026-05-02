import { ROLES } from 'src/enums/roles';

export interface Invitation {
  id: string;
  company_id: string;
  reciever_email: string;
  role: ROLES;
  created_by: string;
  days_to_delete: number;
}
