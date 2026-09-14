import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

import { HnClient } from './hn.client';
import { HnParser } from './hn.parser';
import type { Entry } from './interfaces/entry.interface';

const CACHE_KEY = 'hn:top:30';

@Injectable()
export class CrawlerService {
  private readonly maxEntries: number;

  constructor(
    private readonly client: HnClient,
    private readonly parser: HnParser,
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {
    this.maxEntries = this.config.get<number>('crawl.maxEntries') ?? 30;
  }

  async getTopEntries(): Promise<Entry[]> {
    try {
      const cached = await this.cache.get<Entry[]>(CACHE_KEY);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error('Failed to fetch from cache top entries:', error);
    }

    const html = await this.client.fetchHomepage();
    const entries = this.parser.parseEntries(html, this.maxEntries);
    this.cache.set(CACHE_KEY, entries).catch((err) => {
      console.error('Failed to cache top entries:', err);
    });
    return entries;
  }
}
