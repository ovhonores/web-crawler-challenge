import type { FilterParams, WordOperator } from '@/types/entry';

const OPERATOR_SYMBOL: Record<WordOperator, string> = {
  gt: '>',
  gte: '≥',
  lt: '<',
  lte: '≤',
  eq: '=',
};

interface Props {
  filter: FilterParams;
  resultCount: number;
}

export function ActiveFilterBadge({ filter, resultCount }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-100 px-4 py-2 text-sm">
      <span className="font-medium text-gray-700">Active filter:</span>
      <code className="rounded bg-white px-2 py-1 font-mono text-xs text-gray-900">
        words {OPERATOR_SYMBOL[filter.operator]} {filter.words} → sort by{' '}
        {filter.sortBy} {filter.order}
      </code>
      <span className="text-gray-500">({resultCount} results)</span>
    </div>
  );
}