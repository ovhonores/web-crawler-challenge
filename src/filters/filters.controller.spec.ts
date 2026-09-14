import { Test, TestingModule } from '@nestjs/testing';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';

describe('FiltersController', () => {
  let controller: FiltersController;

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
      controllers: [FiltersController],
      providers: [
        {
          provide: FiltersService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<FiltersController>(FiltersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
