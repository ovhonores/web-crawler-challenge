import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { CrawlerService } from './crawler.service';
import { HnClient } from './hn.client';
import { HnParser } from './hn.parser';
import type { Entry } from './interfaces/entry.interface';

describe('CrawlerService', () => {
  let service: CrawlerService;
  let clientMock: { fetchHomepage: jest.Mock };
  let parserMock: { parseEntries: jest.Mock };
  let configMock: { get: jest.Mock };

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrawlerService,
        { provide: HnClient, useValue: clientMock },
        { provide: HnParser, useValue: parserMock },
        { provide: ConfigService, useValue: configMock },
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

      // Recrear el service para que tome el nuevo valor
      const module = await Test.createTestingModule({
        providers: [
          CrawlerService,
          { provide: HnClient, useValue: clientMock },
          { provide: HnParser, useValue: parserMock },
          { provide: ConfigService, useValue: configMock },
        ],
      }).compile();

      const newService = module.get<CrawlerService>(CrawlerService);
      await newService.getTopEntries();

      expect(parserMock.parseEntries).toHaveBeenCalledWith('<html></html>', 10);
    });
  });
});
