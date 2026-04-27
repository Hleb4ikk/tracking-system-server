import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';
import { AppConfigService } from '../configuration/appConfig.service';

@Injectable()
export class PostgresService extends Client implements OnModuleInit {
  private readonly logger = new Logger(PostgresService.name);

  constructor(private readonly app: AppConfigService) {
    super({
      host: app.database.host,
      port: app.database.port,
      database: app.database.name,
      password: app.database.password,
      user: app.database.username,
      ssl: app.database.ssl,
    });
    this.on('error', (error) => {
      this.logger.error(error.message);
    });
  }

  async onModuleInit() {
    try {
      await this.connect();
      this.logger.log('Connected successfully');
    } catch (error: any) {
      this.logger.error(error.message || 'Failed to connect database');
    }
  }
}
