'use client';

import { useState } from 'react';
import type {
  FilterParams,
  SortBy,
  SortOrder,
  WordOperator,
} from '@/types/entry';

interface Props {
  initial: FilterParams;
  onApply: (params: FilterParams) => void;
  loading: boolean;
}

const OPERATOR_LABEL: Record<WordOperator, string> = {
  gt: '> greater than',
  gte: '≥ greater or equal',
  lt: '< less than',
  lte: '≤ less or equal',
  eq: '= equal',
};

export function AdvancedFilters({ initial, onApply, loading }: Props) {
  const [open, setOpen] = useState(false);
  const [params, setParams] = useState<FilterParams>(initial);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(params);
  };

  return (
    <div className="rounded-lg border border-gray-300">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="font-semibold">Advanced filters</span>
        <span className="text-gray-500">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 border-t p-4 md:grid-cols-5"
        >
          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium">Words</span>
            <input
              type="number"
              min={0}
              value={params.words}
              onChange={(e) =>
                setParams({ ...params, words: Number(e.target.value) })
              }
              className="rounded border px-3 py-2"
            />
          </label>

          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium">Operator</span>
            <select
              value={params.operator}
              onChange={(e) =>
                setParams({
                  ...params,
                  operator: e.target.value as WordOperator,
                })
              }
              className="rounded border px-3 py-2"
            >
              {(Object.keys(OPERATOR_LABEL) as WordOperator[]).map((op) => (
                <option key={op} value={op}>
                  {OPERATOR_LABEL[op]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium">Sort by</span>
            <select
              value={params.sortBy}
              onChange={(e) =>
                setParams({ ...params, sortBy: e.target.value as SortBy })
              }
              className="rounded border px-3 py-2"
            >
              <option value="points">Points</option>
              <option value="comments">Comments</option>
              <option value="number">Number</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium">Order</span>
            <select
              value={params.order}
              onChange={(e) =>
                setParams({ ...params, order: e.target.value as SortOrder })
              }
              className="rounded border px-3 py-2"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="self-end rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Apply'}
          </button>
        </form>
      )}
    </div>
  );
}