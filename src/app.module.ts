import { Module } from '@nestjs/common';
import { AppConfigModule } from './modules/configuration/appConfig.module';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';

@Module({
  imports: [AppConfigModule, AuthModule, CompanyModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
