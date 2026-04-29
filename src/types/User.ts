import { ROLES } from 'src/enums/roles';

export type User = {
  id: string;
  email: string;
  username: string;
  name: string;
  surname: string;
  isAdmin: boolean;
} & (
  | {
      company_id: string;
      role: ROLES;
    }
  | {
      company_id: null;
      role: null;
    }
);

export type UserWithPassword = User & {
  hashed_password: string;
};
