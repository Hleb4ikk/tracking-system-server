import { Module } from '@nestjs/common';
import { AppConfigModule } from './modules/configuration/appConfig.module';

@Module({
  imports: [AppConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
