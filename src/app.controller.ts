import { Controller, Get } from '@nestjs/common';
import { AppConfigService } from './modules/configuration/appConfig.service';

@Controller()
export class AppController {
  constructor(readonly appConfig: AppConfigService) {}

  @Get()
  healthCheck() {
    return {
      message: `Server is working on port ${this.appConfig.configuration.appPort}`,
    };
  }
}
