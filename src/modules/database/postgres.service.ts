import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Pool, PoolClient, QueryResultRow } from 'pg'; // Используем Pool вместо Client
import { AppConfigService } from '../configuration/appConfig.service';

@Injectable()
export class PostgresService implements OnModuleInit {
  private readonly logger = new Logger(PostgresService.name);
  private pool: Pool;

  constructor(private readonly app: AppConfigService) {
    this.pool = new Pool({
      host: app.database.host,
      port: app.database.port,
      database: app.database.name,
      password: app.database.password,
      user: app.database.username,
      ssl: app.database.ssl,
      max: 20,
    });
  }

  async onModuleInit() {
    try {
      await this.pool.query('SELECT NOW()');
      this.logger.log('Database pool initialized');
    } catch (error: any) {
      this.logger.error('Failed to connect database', error.stack);
    }
  }

  async query<T extends QueryResultRow>(text: string, params?: any[]) {
    return this.pool.query<T>(text, params);
  }

  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }
}
