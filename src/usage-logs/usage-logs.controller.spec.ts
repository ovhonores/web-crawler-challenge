import { Test, TestingModule } from '@nestjs/testing';

import { UsageLogsController } from './usage-logs.controller';
import { UsageLogsService } from './usage-logs.service';

describe('UsageLogsController', () => {
  let controller: UsageLogsController;
  let serviceMock: {
    findAll: jest.Mock;
    log: jest.Mock;
  };

  beforeEach(async () => {
    serviceMock = {
      findAll: jest.fn(),
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsageLogsController],
      providers: [
        {
          provide: UsageLogsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<UsageLogsController>(UsageLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll with parsed limit', async () => {
      serviceMock.findAll.mockResolvedValue([]);

      await controller.findAll('50');

      expect(serviceMock.findAll).toHaveBeenCalledWith(50);
    });

    it('should default to 100 when no limit is provided', async () => {
      serviceMock.findAll.mockResolvedValue([]);

      await controller.findAll(undefined);

      expect(serviceMock.findAll).toHaveBeenCalledWith(100);
    });
  });
});
