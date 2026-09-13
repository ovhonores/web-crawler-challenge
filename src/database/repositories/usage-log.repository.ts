import { UsageLog } from '../entities/usage-log.interface';

export interface UsageLogRepository {
  save(log: Omit<UsageLog, 'id' | 'timestamp'>): Promise<UsageLog>;
  findAll(limit?: number): Promise<UsageLog[]>;
}

export const USAGE_LOG_REPOSITORY = Symbol('USAGE_LOG_REPOSITORY');
