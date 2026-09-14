'use client';

import { FILTER_MORE_THAN_5_WORDS, FILTER_FEWER_OR_EQUAL_5_WORDS } from '@/lib/constants';
import type { FilterParams } from '@/types/entry';

interface Props {
  onApply: (params: FilterParams) => void;
  loading: boolean;
  activeFilter: FilterParams;
}

const isActive = (a: FilterParams, b: FilterParams): boolean =>
  a.words === b.words &&
  a.operator === b.operator &&
  a.sortBy === b.sortBy &&
  a.order === b.order;

export function QuickFilters({ onApply, loading, activeFilter }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <button
        onClick={() => onApply(FILTER_MORE_THAN_5_WORDS)}
        disabled={loading}
        className={`rounded-lg border-2 p-4 text-left transition disabled:opacity-50 ${
          isActive(activeFilter, FILTER_MORE_THAN_5_WORDS)
            ? 'border-blue-600 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <div className="font-semibold text-gray-900">
          More than 5 words → by comments
        </div>
        <div className="mt-1 text-sm text-gray-600">
          Titles with &gt; 5 words, sorted by number of comments (desc)
        </div>
      </button>

      <button
        onClick={() => onApply(FILTER_FEWER_OR_EQUAL_5_WORDS)}
        disabled={loading}
        className={`rounded-lg border-2 p-4 text-left transition disabled:opacity-50 ${
          isActive(activeFilter, FILTER_FEWER_OR_EQUAL_5_WORDS)
            ? 'border-green-600 bg-green-50'
            : 'border-gray-300 hover:border-green-400'
        }`}
      >
        <div className="font-semibold text-gray-900">
          5 or fewer words → by points
        </div>
        <div className="mt-1 text-sm text-gray-600">
          Titles with ≤ 5 words, sorted by points (desc)
        </div>
      </button>
    </div>
  );
}