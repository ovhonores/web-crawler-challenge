import { Module } from '@nestjs/common';

import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { HnClient } from './hn.client';
import { HnParser } from './hn.parser';

@Module({
  controllers: [CrawlerController],
  providers: [CrawlerService, HnClient, HnParser],
  exports: [CrawlerService],
})
export class CrawlerModule {}
