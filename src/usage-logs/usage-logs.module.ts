import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { UsageLogsController } from './usage-logs.controller';
import { UsageLogsService } from './usage-logs.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsageLogsController],
  providers: [UsageLogsService],
  exports: [UsageLogsService],
})
export class UsageLogsModule {}
