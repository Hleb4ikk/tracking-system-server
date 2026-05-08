import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RecieverRepository } from './reciever.repository';
import { RecieverService } from './reciever.service';
import { RecieverController } from './reciever.controller';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, CompanyModule, UserModule],
  controllers: [RecieverController],
  providers: [RecieverRepository, RecieverService],
  exports: [RecieverRepository, RecieverService],
})
export class RecieverModule {}
