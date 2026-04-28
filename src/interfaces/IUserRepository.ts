import { CreateUserDto } from 'src/schemas/userSchemas';
import { User, UserWithPassword } from 'src/types/User';

export interface IUserRepository {
  createUser(createUserDto: CreateUserDto): Promise<User>;

  findUserByEmail(email: string): Promise<UserWithPassword | null>;

  findUserById(id: string): Promise<UserWithPassword | null>;
}
