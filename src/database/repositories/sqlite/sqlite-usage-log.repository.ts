import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsageLogRepository } from '../usage-log.repository';
import { UsageLog } from '../../entities/usage-log.interface';
import { UsageLogEntity } from './usage-log.entity';

@Injectable()
export class SqliteUsageLogRepository implements UsageLogRepository {
  constructor(
    @InjectRepository(UsageLogEntity)
    private readonly repo: Repository<UsageLogEntity>,
  ) {}

  async save(log: Omit<UsageLog, 'id' | 'timestamp'>): Promise<UsageLog> {
    const entity = this.repo.create(log);
    return this.repo.save(entity);
  }

  async findAll(limit = 100): Promise<UsageLog[]> {
    return this.repo.find({
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }
}
