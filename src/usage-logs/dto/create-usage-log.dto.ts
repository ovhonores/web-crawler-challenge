export class CreateUsageLogDto {
  filter: string;
  entriesReturned: number;
  executionMs?: number;
  userAgent?: string;
  ip?: string;
}
