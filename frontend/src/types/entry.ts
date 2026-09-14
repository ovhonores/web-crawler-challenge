export interface Entry {
  number: number;
  title: string;
  points: number;
  comments: number;
}

export interface UsageLog {
  id: number;
  filter: string;
  entriesReturned: number;
  executionMs: number;
  userAgent: string;
  ip: string;
  status: string;
  timestamp: string;
}

export type WordOperator = 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
export type SortBy = 'points' | 'comments' | 'number';
export type SortOrder = 'asc' | 'desc';

export interface FilterParams {
  words: number;
  operator: WordOperator;
  sortBy: SortBy;
  order: SortOrder;
}