import { Controller, Get } from '@nestjs/common';
import { AppConfigService } from './modules/configuration/appConfig.service';

@Controller()
export class AppController {
  constructor(readonly configService: AppConfigService) {}

  @Get()
  healthCheck() {
    return {
      message: `Server is working on port ${this.configService.app.port}`,
    };
  }
}
