import { Test, TestingModule } from '@nestjs/testing';
import { UsageLogsController } from './usage-logs.controller';

describe('UsageLogsController', () => {
  let controller: UsageLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsageLogsController],
    }).compile();

    controller = module.get<UsageLogsController>(UsageLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
