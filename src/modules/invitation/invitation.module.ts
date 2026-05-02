import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { InvitationService } from './invitation.service';
import { InvitationRepository } from './invitation.repository';
import { CompanyModule } from '../company/company.module';
import { InvitationController } from './invitation.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, CompanyModule, UserModule],
  controllers: [InvitationController],
  providers: [InvitationRepository, InvitationService],
  exports: [InvitationService, InvitationRepository],
})
export class InvitationModule {}
