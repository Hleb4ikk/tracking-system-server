import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './modules/configuration/appConfig.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfigService).configuration;

  await app.listen(config.appPort, config.appHost);
}
bootstrap();
