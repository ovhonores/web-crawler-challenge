import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { SqliteUsageLogRepository } from './sqlite-usage-log.repository';
import { UsageLogEntity } from './usage-log.entity';
import { UsageLog } from '../../entities/usage-log.interface';

describe('SqliteUsageLogRepository', () => {
  let repository: SqliteUsageLogRepository;
  let repoMock: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
  };

  beforeEach(async () => {
    repoMock = {
      create: jest.fn((data: UsageLog) => data),
      save: jest.fn(),
      find: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        SqliteUsageLogRepository,
        {
          provide: getRepositoryToken(UsageLogEntity),
          useValue: repoMock,
        },
      ],
    }).compile();

    repository = module.get(SqliteUsageLogRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should call repo.create and repo.save', async () => {
      const data = {
        filter: 'more_than_5_by_comments',
        entriesReturned: 12,
        executionMs: 340,
      };
      const savedEntity = { id: 1, timestamp: new Date(), ...data };
      repoMock.save.mockResolvedValue(savedEntity);

      const result = await repository.save(data);

      expect(repoMock.create).toHaveBeenCalledWith(data);
      expect(repoMock.save).toHaveBeenCalledWith(data);
      expect(result).toEqual(savedEntity);
    });
  });

  describe('findAll', () => {
    it('should return records ordered by timestamp desc', async () => {
      const records = [
        { id: 2, timestamp: new Date('2026-01-02') },
        { id: 1, timestamp: new Date('2026-01-01') },
      ];
      repoMock.find.mockResolvedValue(records);

      const result = await repository.findAll(50);

      expect(repoMock.find).toHaveBeenCalledWith({
        order: { timestamp: 'DESC' },
        take: 50,
      });
      expect(result).toEqual(records);
    });

    it('should default to 100 records', async () => {
      repoMock.find.mockResolvedValue([]);

      await repository.findAll();

      expect(repoMock.find).toHaveBeenCalledWith({
        order: { timestamp: 'DESC' },
        take: 100,
      });
    });
  });
});
