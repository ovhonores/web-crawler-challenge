import { FilterStatus } from '../../usage-logs/dto/create-usage-log.dto';

export interface UsageLog {
  id: number;
  filter: string;
  entriesReturned: number;
  timestamp: Date;
  executionMs?: number;
  userAgent?: string;
  ip?: string;
  status?: FilterStatus;
  erroMessage?: string;
}
