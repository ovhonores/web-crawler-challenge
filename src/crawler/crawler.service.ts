import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HnClient } from './hn.client';
import { HnParser } from './hn.parser';
import type { Entry } from './interfaces/entry.interface';

@Injectable()
export class CrawlerService {
  private readonly maxEntries: number;

  constructor(
    private readonly client: HnClient,
    private readonly parser: HnParser,
    private readonly config: ConfigService,
  ) {
    this.maxEntries = this.config.get<number>('crawl.maxEntries') ?? 30;
  }

  async getTopEntries(): Promise<Entry[]> {
    const html = await this.client.fetchHomepage();
    return this.parser.parseEntries(html, this.maxEntries);
  }
}
