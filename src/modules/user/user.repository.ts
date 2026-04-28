import { Injectable } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { CreateUserDto } from 'src/schemas/userSchemas';
import { User, UserWithPassword } from 'src/types/User';
import { IUserRepository } from 'src/interfaces/IUserRepository';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly postgresService: PostgresService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const result = await this.postgresService.query<User>(
      `
         INSERT INTO users(email, name, surname, username, hashed_password) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, email, name, surname, username, company_id;
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
  }

  async findUserByEmail(email: string): Promise<UserWithPassword | null> {
    const result = await this.postgresService.query<UserWithPassword>(
      `
         SELECT * FROM users WHERE users.email = $1;
         `,
      [email],
    );

    return result.rows[0] ?? null;
  }

  async findUserById(id: string): Promise<UserWithPassword | null> {
    const result = await this.postgresService.query<UserWithPassword>(
      `
         SELECT * FROM users WHERE users.id = $1;
         `,
      [id],
    );

    return result.rows[0] ?? null;
  }
}
