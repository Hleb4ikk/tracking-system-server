import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfiguration } from 'src/interfaces/AppConfiguration';

@Injectable()
export class AppConfigService {
  readonly configuration: IAppConfiguration;
  constructor(private configService: ConfigService) {
    this.configuration = {
      appHost: this.configService.getOrThrow('APP_HOST'),
      appPort: this.configService.getOrThrow('APP_PORT'),
    };
  }
}
