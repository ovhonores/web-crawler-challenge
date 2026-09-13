import { Controller, Get, Query } from '@nestjs/common';

import { UsageLogsService } from './usage-logs.service';
import { UsageLog } from '../database/entities/usage-log.interface';

@Controller('usage')
export class UsageLogsController {
  constructor(private readonly usageLogsService: UsageLogsService) {}

  @Get()
  async findAll(@Query('limit') limit?: string): Promise<UsageLog[]> {
    const parsedLimit = limit ? parseInt(limit, 10) : 100;
    return this.usageLogsService.findAll(parsedLimit);
  }
}
