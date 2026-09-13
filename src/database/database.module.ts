import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { USAGE_LOG_REPOSITORY } from './repositories/usage-log.repository';
import { SqliteUsageLogRepository } from './repositories/sqlite/sqlite-usage-log.repository';
import { UsageLogEntity } from './repositories/sqlite/usage-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'better-sqlite3',
        database: config.get<string>('database.sqlitePath'),
        entities: [UsageLogEntity],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([UsageLogEntity]),
  ],
  providers: [
    {
      provide: USAGE_LOG_REPOSITORY,
      useClass: SqliteUsageLogRepository,
    },
  ],
  exports: [USAGE_LOG_REPOSITORY],
})
export class DatabaseModule {}
