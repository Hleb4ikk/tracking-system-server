import { ROLES } from 'src/enums/roles';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  surname: string;
  role: ROLES | null;
  isAdmin: boolean;
  company_id: string | null;
}
export interface UserWithPassword extends User {
  hashed_password: string;
}
