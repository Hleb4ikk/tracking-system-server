import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from 'src/schemas/userSchemas';
import { User, UserWithPassword } from 'src/types/User';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(createUserDto);
  }
  async findUserByEmail(email: string): Promise<UserWithPassword | null> {
    return await this.userRepository.findUserByEmail(email);
  }
  async findUserById(id: string): Promise<User | null> {
    return await this.userRepository.findUserById(id);
  }
}
