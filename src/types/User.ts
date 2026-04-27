export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  surname: string;
}
export interface UserWithPassword extends User {
  hashed_password: string;
}
