import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { CreateUserDto } from 'src/schemas/userSchemas';
import { User, UserWithPassword } from 'src/types/User';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly postgresService: PostgresService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const result = await this.postgresService.query<User>(
        `
         INSERT INTO users(email, name, surname, username, hashed_password) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, email, name, surname, username;
         `,
        [
          createUserDto.email,
          createUserDto.name,
          createUserDto.surname,
          createUserDto.username,
          createUserDto.password,
        ],
      );

      return result.rows[0];
    } catch (e: any) {
      this.logger.error(e.message);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findUserByEmail(email: string): Promise<UserWithPassword | null> {
    try {
      const result = await this.postgresService.query<UserWithPassword>(
        `
         SELECT * FROM users WHERE users.email = $1;
         `,
        [email],
      );

      return result.rows[0] ?? null;
    } catch (e: any) {
      this.logger.error(e.message);
      throw new InternalServerErrorException('Failed to find user by email');
    }
  }

  async findUserById(id: string): Promise<UserWithPassword | null> {
    try {
      const result = await this.postgresService.query<UserWithPassword>(
        `
         SELECT * FROM users WHERE users.id = $1;
         `,
        [id],
      );

      return result.rows[0] ?? null;
    } catch (e: any) {
      this.logger.error(e.message);
      throw new InternalServerErrorException('Failed to find user by id');
    }
  }
}
