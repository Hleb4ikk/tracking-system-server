import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyRepository } from './company.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository],
  exports: [CompanyService, CompanyRepository],
})
export class CompanyModule {}
