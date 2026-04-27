import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AppConfiguration,
  CoookieConfiguration,
  DatabaseConfiguration,
  JWTConfiguration,
} from 'src/interfaces/configuration';

@Injectable()
export class AppConfigService {
  readonly app: AppConfiguration;
  readonly database: DatabaseConfiguration;
  readonly jwt: JWTConfiguration;
  readonly cookie: CoookieConfiguration;

  constructor(private configService: ConfigService) {
    this.app = {
      port: this.configService.getOrThrow('APP_PORT'),
      host: this.configService.getOrThrow('APP_HOST'),
    };
    this.database = {
      name: this.configService.getOrThrow('DB_NAME'),
      username: this.configService.getOrThrow('DB_USERNAME'),
      host: this.configService.getOrThrow('DB_HOST'),
      port: this.configService.getOrThrow('DB_PORT'),
      password: this.configService.getOrThrow('DB_PASSWORD'),
      ssl: this.configService.getOrThrow('DB_SSL') === 'true',
    };
    this.jwt = {
      accessTokenAge: this.configService.getOrThrow('ACCESS_TOKEN_AGE'),
      refreshTokenAge: this.configService.getOrThrow('REFRESH_TOKEN_AGE'),
      accessSecretValue: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      refreshSecretValue: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
    };
    this.cookie = {
      httpOnly: this.configService.getOrThrow('COOKIE_HTTP_ONLY') === 'true',
      secure: this.configService.getOrThrow('COOKIE_SECURE') === 'true',
      sameSite: this.configService.getOrThrow('COOKIE_SAME_SITE'),
      path: this.configService.getOrThrow('COOKIE_PATH'),
    };
  }
}
