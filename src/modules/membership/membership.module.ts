import { Module } from '@nestjs/common';
import { MembershipRepository } from './membership.repository';
import { MembershipService } from './membership.service';
import { DatabaseModule } from '../database/database.module';
import { CompanyModule } from '../company/company.module';
import { MembershipController } from './membership.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, CompanyModule, UserModule],
  controllers: [MembershipController],
  providers: [MembershipRepository, MembershipService],
  exports: [MembershipService, MembershipRepository],
})
export class MembershipModule {}
