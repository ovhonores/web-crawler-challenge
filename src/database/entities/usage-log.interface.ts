export interface UsageLog {
  id: number;
  filter: string;
  entriesReturned: number;
  executionMs?: number;
  userAgent?: string;
  ip?: string;
  timestamp: Date;
}
