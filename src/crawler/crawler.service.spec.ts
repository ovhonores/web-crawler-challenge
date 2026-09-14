import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { CrawlerService } from './crawler.service';
import { HnClient } from './hn.client';
import { HnParser } from './hn.parser';
import type { Entry } from './interfaces/entry.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CrawlerService', () => {
  let service: CrawlerService;
  let clientMock: { fetchHomepage: jest.Mock };
  let parserMock: { parseEntries: jest.Mock };
  let configMock: { get: jest.Mock };
  let cacheMock: { get: jest.Mock; set: jest.Mock };

  const mockEntries: Entry[] = [
    { number: 1, title: 'Test entry', points: 100, comments: 10 },
  ];

  beforeEach(async () => {
    clientMock = {
      fetchHomepage: jest.fn().mockResolvedValue('<html></html>'),
    };
    parserMock = {
      parseEntries: jest.fn().mockReturnValue(mockEntries),
    };
    configMock = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'crawl.baseUrl') return 'https://news.ycombinator.com/';
        if (key === 'crawl.maxEntries') return 30;
        return undefined;
      }),
    };

    cacheMock = {
      get: jest.fn().mockResolvedValue(undefined),
      set: jest.fn().mockResolvedValue(undefined),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrawlerService,
        { provide: HnClient, useValue: clientMock },
        { provide: HnParser, useValue: parserMock },
        { provide: ConfigService, useValue: configMock },
        { provide: CACHE_MANAGER, useValue: cacheMock },
      ],
    }).compile();

    service = module.get<CrawlerService>(CrawlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTopEntries', () => {
    it('should fetch homepage and parse entries', async () => {
      const result = await service.getTopEntries();

      expect(clientMock.fetchHomepage).toHaveBeenCalledTimes(1);
      expect(parserMock.parseEntries).toHaveBeenCalledWith('<html></html>', 30);
      expect(result).toEqual(mockEntries);
    });

    it('should use maxEntries from config', async () => {
      configMock.get.mockImplementation((key: string) => {
        if (key === 'crawl.maxEntries') return 10;
        return undefined;
      });

      const module = await Test.createTestingModule({
        providers: [
          CrawlerService,
          { provide: HnClient, useValue: clientMock },
          { provide: HnParser, useValue: parserMock },
          { provide: ConfigService, useValue: configMock },
          { provide: CACHE_MANAGER, useValue: cacheMock }, // ← añadir esto
        ],
      }).compile();

      const newService = module.get<CrawlerService>(CrawlerService);
      await newService.getTopEntries();

      expect(parserMock.parseEntries).toHaveBeenCalledWith('<html></html>', 10);
    });
  });
  describe('getTopEntries', () => {
    it('should return cached entries on cache hit', async () => {
      cacheMock.get.mockResolvedValue(mockEntries);

      const result = await service.getTopEntries();

      expect(result).toEqual(mockEntries);
      expect(clientMock.fetchHomepage).not.toHaveBeenCalled();
      expect(parserMock.parseEntries).not.toHaveBeenCalled();
    });

    it('should fetch and cache entries on cache miss', async () => {
      cacheMock.get.mockResolvedValue(undefined);

      const result = await service.getTopEntries();

      expect(clientMock.fetchHomepage).toHaveBeenCalledTimes(1);
      expect(parserMock.parseEntries).toHaveBeenCalledWith('<html></html>', 30);
      expect(cacheMock.set).toHaveBeenCalledWith('hn:top:30', mockEntries);
      expect(result).toEqual(mockEntries);
    });
  });
});
