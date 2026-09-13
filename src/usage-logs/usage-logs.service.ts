import { Inject, Injectable } from '@nestjs/common';

import { USAGE_LOG_REPOSITORY } from '../database/repositories/usage-log.repository';
import type { UsageLogRepository } from '../database/repositories/usage-log.repository';
import type { UsageLog } from '../database/entities/usage-log.interface';
import type { CreateUsageLogDto } from './dto/create-usage-log.dto';

@Injectable()
export class UsageLogsService {
  constructor(
    @Inject(USAGE_LOG_REPOSITORY)
    private readonly repo: UsageLogRepository,
  ) {}

  async log(dto: CreateUsageLogDto): Promise<void> {
    await this.repo.save(dto);
  }

  async findAll(limit = 100): Promise<UsageLog[]> {
    return this.repo.findAll(limit);
  }
}
