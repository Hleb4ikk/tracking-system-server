import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './modules/configuration/appConfig.service';
import cookieParser from 'cookie-parser';
import cors from 'cors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
    }),
  );

  app.use(cookieParser());

  const config = app.get(AppConfigService).app;

  await app.listen(config.port, config.host);
}
bootstrap();
