import { Module } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { AppConfigModule } from '../configuration/appConfig.module';

@Module({
  imports: [AppConfigModule],
  exports: [PostgresService],
  providers: [PostgresService],
})
export class DatabaseModule {}
