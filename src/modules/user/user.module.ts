import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DatabaseModule } from '../database/database.module';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  providers: [UserRepository, UserService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
