import type { FilterParams } from '@/types/entry';

export const FILTER_MORE_THAN_5_WORDS: FilterParams = {
  words: 5,
  operator: 'gt',
  sortBy: 'comments',
  order: 'desc',
};

export const FILTER_FEWER_OR_EQUAL_5_WORDS: FilterParams = {
  words: 5,
  operator: 'lte',
  sortBy: 'points',
  order: 'desc',
};