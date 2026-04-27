import { Module } from '@nestjs/common';
import { AppConfigModule } from './modules/configuration/appConfig.module';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AppConfigModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
