export enum FilterStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}
export class CreateUsageLogDto {
  filter: string;
  entriesReturned: number;
  executionMs?: number;
  userAgent?: string;
  ip?: string;
  status?: FilterStatus;
  errorMessage?: string;
}
