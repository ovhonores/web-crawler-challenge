import { Module } from '@nestjs/common';
import { UsageLogsService } from './usage-logs.service';
import { UsageLogsController } from './usage-logs.controller';

@Module({
  providers: [UsageLogsService],
  controllers: [UsageLogsController],
})
export class UsageLogsModule {}
