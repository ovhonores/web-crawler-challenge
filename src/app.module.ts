import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { CrawlerModule } from './crawler/crawler.module';
import { FiltersModule } from './filters/filters.module';
import { UsageLogsModule } from './usage-logs/usage-logs.module';

@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    CrawlerModule,
    FiltersModule,
    UsageLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
