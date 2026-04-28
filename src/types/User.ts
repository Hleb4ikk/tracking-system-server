export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  surname: string;
  company_id: string | null;
}
export interface UserWithPassword extends User {
  hashed_password: string;
}
