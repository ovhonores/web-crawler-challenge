import { Test, TestingModule } from '@nestjs/testing';

import { UsageLogsService } from './usage-logs.service';
import { USAGE_LOG_REPOSITORY } from '../database/repositories/usage-log.repository';

describe('UsageLogsService', () => {
  let service: UsageLogsService;
  let repoMock: {
    save: jest.Mock;
    findAll: jest.Mock;
  };

  beforeEach(async () => {
    repoMock = {
      save: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsageLogsService,
        {
          provide: USAGE_LOG_REPOSITORY,
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<UsageLogsService>(UsageLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('should call repo.save with the given dto', async () => {
      const dto = {
        filter: 'more_than_5_by_comments',
        entriesReturned: 12,
        executionMs: 340,
      };

      await service.log(dto);

      expect(repoMock.save).toHaveBeenCalledWith(dto);
      expect(repoMock.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should call repo.findAll with the given limit', async () => {
      repoMock.findAll.mockResolvedValue([]);

      await service.findAll(50);

      expect(repoMock.findAll).toHaveBeenCalledWith(50);
    });

    it('should default to 100 records', async () => {
      repoMock.findAll.mockResolvedValue([]);

      await service.findAll();

      expect(repoMock.findAll).toHaveBeenCalledWith(100);
    });
  });
});
