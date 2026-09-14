import { Module } from '@nestjs/common';

import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';
import { CrawlerModule } from '../crawler/crawler.module';
import { UsageLogsModule } from '../usage-logs/usage-logs.module';

@Module({
  imports: [CrawlerModule, UsageLogsModule],
  controllers: [FiltersController],
  providers: [FiltersService],
})
export class FiltersModule {}
