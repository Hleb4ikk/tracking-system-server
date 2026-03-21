import { Module } from '@nestjs/common';
import { AppConfigModule } from './modules/configuration/appConfig.module';
import { AppController } from './app.controller';

@Module({
  imports: [AppConfigModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
