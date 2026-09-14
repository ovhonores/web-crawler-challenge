import { Injectable } from '@nestjs/common';

import { CrawlerService } from '../crawler/crawler.service';
import { UsageLogsService } from '../usage-logs/usage-logs.service';
import { wordCount } from './word-counter';
import {
  FilterQueryDto,
  SortBy,
  SortOrder,
  WordOperator,
} from './dto/filter-query.dto';
import type { Entry } from '../crawler/interfaces/entry.interface';
import {
  CreateUsageLogDto,
  FilterStatus,
} from '../usage-logs/dto/create-usage-log.dto';

@Injectable()
export class FiltersService {
  constructor(
    private readonly crawler: CrawlerService,
    private readonly usageLogs: UsageLogsService,
  ) {}

  async getFilteredEntries(
    query: FilterQueryDto,
    ctx: { ip: string; userAgent: string },
  ): Promise<Entry[]> {
    const startedAt = Date.now();
    try {
      const entries = await this.crawler.getTopEntries();
      const filtered = this.applyFilters(entries, query);

      const executionMs = Date.now() - startedAt;
      await this.usageLogs.log({
        filter: this.serializeQuery(query),
        entriesReturned: filtered.length,
        executionMs,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        status: FilterStatus.SUCCESS,
      });
      return filtered;
    } catch (error) {
      console.log('Error in getFilteredEntries:', error);
      const executionMs = Date.now() - startedAt;
      await this.usageLogs.log({
        filter: this.serializeQuery(query),
        entriesReturned: 0,
        executionMs,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        status: FilterStatus.ERROR,
        errorMessage: (error as Error).message,
      });
      throw error;
    }
  }

  async saveUsageLog(dto: CreateUsageLogDto): Promise<void> {
    await this.usageLogs.log(dto);
  }

  private applyFilters(entries: Entry[], query: FilterQueryDto): Entry[] {
    const {
      words = 5,
      operator = WordOperator.GT,
      sortBy = SortBy.COMMENTS,
      order = SortOrder.DESC,
    } = query;

    const filtered = entries.filter((e) =>
      this.compare(wordCount(e.title), words, operator),
    );

    return this.sort(filtered, sortBy, order);
  }

  private compare(
    value: number,
    target: number,
    operator: WordOperator,
  ): boolean {
    switch (operator) {
      case WordOperator.GT:
        return value > target;
      case WordOperator.GTE:
        return value >= target;
      case WordOperator.LT:
        return value < target;
      case WordOperator.LTE:
        return value <= target;
      case WordOperator.EQ:
        return value === target;
    }
  }

  private sort(entries: Entry[], sortBy: SortBy, order: SortOrder): Entry[] {
    const direction = order === SortOrder.ASC ? 1 : -1;
    return [...entries].sort((a, b) => (a[sortBy] - b[sortBy]) * direction);
  }

  private serializeQuery(query: FilterQueryDto): string {
    return `words=${query.words}&operator=${query.operator}&sortBy=${query.sortBy}&order=${query.order}`;
  }
}
