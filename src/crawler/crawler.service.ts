import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

import { HnClient } from './hn.client';
import { HnParser } from './hn.parser';
import type { Entry } from './interfaces/entry.interface';
import { withTimeout } from '../common/with-timeout';

const CACHE_KEY = 'hn:top:30'; // Key for caching the top 30 entries

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
    console.log('getTopEntries called, maxEntries:', this.maxEntries);
    try {
      const cached = await withTimeout(
        this.cache.get<Entry[]>(CACHE_KEY),
        3000, // ← 3 seconds
      );
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error('Failed to fetch from cache top entries:', error);
    }
    console.log('Fetching top entries from Hacker News...');
    const html = await this.client.fetchHomepage();
    const entries = this.parser.parseEntries(html, this.maxEntries);
    try {
      await withTimeout(this.cache.set(CACHE_KEY, entries), 3000); // ← 3 seconds
    } catch (error) {
      console.error('Cache set failed or timed out:', error);
    }

    return entries;
  }
}
