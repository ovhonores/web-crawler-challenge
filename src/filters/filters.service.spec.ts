import { Test, TestingModule } from '@nestjs/testing';

import { FiltersService } from './filters.service';
import { CrawlerService } from '../crawler/crawler.service';
import { UsageLogsService } from '../usage-logs/usage-logs.service';
import {
  FilterQueryDto,
  SortBy,
  SortOrder,
  WordOperator,
} from './dto/filter-query.dto';
import type { Entry } from '../crawler/interfaces/entry.interface';

const makeEntry = (
  number: number,
  title: string,
  points: number,
  comments: number,
): Entry => ({ number, title, points, comments });
const ctx = {
  ip: '127.0.0.1',
  userAgent: 'Test User Agent',
};
describe('FiltersService', () => {
  let service: FiltersService;
  let crawlerMock: { getTopEntries: jest.Mock };
  let usageLogsMock: { log: jest.Mock };

  const entries: Entry[] = [
    makeEntry(
      1,
      'Show HN: I built a self-hosted alternative to Notion',
      320,
      145,
    ),
    makeEntry(2, 'The fall of the Roman Empire', 210, 89),
    makeEntry(3, 'Why Rust is eating C++', 480, 230),
    makeEntry(4, 'Ask HN: How do you handle burnout?', 150, 312),
    makeEntry(5, 'New JavaScript engine released', 95, 12),
    makeEntry(6, 'A deep dive into PostgreSQL internals', 260, 41),
    makeEntry(7, 'Linux kernel 6.9 is out', 410, 178),
    makeEntry(8, 'My startup failed and here is what I learned', 180, 402),
  ];

  beforeEach(async () => {
    crawlerMock = {
      getTopEntries: jest.fn().mockResolvedValue(entries),
    };
    usageLogsMock = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FiltersService,
        { provide: CrawlerService, useValue: crawlerMock },
        { provide: UsageLogsService, useValue: usageLogsMock },
      ],
    }).compile();

    service = module.get<FiltersService>(FiltersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should filter >5 words and sort by comments desc', async () => {
    const query: FilterQueryDto = {
      words: 5,
      operator: WordOperator.GT,
      sortBy: SortBy.COMMENTS,
      order: SortOrder.DESC,
    };

    const result = await service.getFilteredEntries(query, ctx);

    expect(result).toHaveLength(5);
    expect(result.map((e) => e.number)).toEqual([8, 4, 1, 2, 6]);
  });

  it('should filter <=5 words and sort by points desc', async () => {
    const query: FilterQueryDto = {
      words: 5,
      operator: WordOperator.LTE,
      sortBy: SortBy.POINTS,
      order: SortOrder.DESC,
    };

    const result = await service.getFilteredEntries(query, ctx);

    expect(result).toHaveLength(3);
    expect(result.map((e) => e.number)).toEqual([3, 7, 5]);
  });

  it('should support ascending order', async () => {
    const query: FilterQueryDto = {
      words: 5,
      operator: WordOperator.LTE,
      sortBy: SortBy.POINTS,
      order: SortOrder.ASC,
    };

    const result = await service.getFilteredEntries(query, ctx);

    expect(result.map((e) => e.points)).toEqual([95, 410, 480]);
  });

  it('should log usage with serialized query', async () => {
    const query: FilterQueryDto = {
      words: 5,
      operator: WordOperator.GT,
      sortBy: SortBy.COMMENTS,
      order: SortOrder.DESC,
    };

    await service.getFilteredEntries(query, ctx);

    expect(usageLogsMock.log).toHaveBeenCalledWith({
      filter: 'words=5&operator=gt&sortBy=comments&order=desc',
      entriesReturned: 5,
      executionMs: expect.any(Number) as number,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      status: 'success',
    });
  });
});
