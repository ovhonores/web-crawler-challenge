'use client';

import { useState } from 'react';
import { fetchEntries, fetchUsage } from '@/lib/api';
import { QuickFilters } from '@/components/QuickFilters';
import { AdvancedFilters } from '@/components/AdvancedFilters';
import { ActiveFilterBadge } from '@/components/ActiveFilterBadge';
import { EntryTable } from '@/components/EntryTable';
import { UsageTable } from '@/components/UsageTable';
import { CollapsibleSection } from '@/components/CollapsibleSection';
import type { Entry, FilterParams, UsageLog } from '@/types/entry';
import { EntryTableSkeleton } from './EntryTableSkeleton';

interface Props {
  initialEntries: Entry[];
  initialUsage: UsageLog[];
  initialFilter: FilterParams;
}

export function HomeClient({
  initialEntries,
  initialUsage,
  initialFilter,
}: Props) {
  const [entries, setEntries] = useState(initialEntries);
  const [usage, setUsage] = useState(initialUsage);
  const [filter, setFilter] = useState(initialFilter);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (params: FilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const [entriesData, usageData] = await Promise.all([
        fetchEntries(params),
        fetchUsage(),
      ]);
      setEntries(entriesData);
      setUsage(usageData);
      setFilter(params);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">HN Crawler Challenge</h1>
        <p className="mt-1 text-gray-600">
          Filter the top 30 entries from Hacker News by word count, sorting, and
          order.
        </p>
      </header>

      <section className="mb-6 space-y-4">
        <QuickFilters
          onApply={(params) => void load(params)}
          loading={loading}
          activeFilter={filter}
        />
        <AdvancedFilters
          initial={filter}
          onApply={(params) => void load(params)}
          loading={loading}
        />
      </section>

      <section className="mb-6">
        <ActiveFilterBadge filter={filter} resultCount={entries.length} />
      </section>

      {error && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      <section className="mb-8">
        <CollapsibleSection title="Entries" count={entries.length} defaultOpen>
          {loading? <EntryTableSkeleton /> : <EntryTable entries={entries} />}
        </CollapsibleSection>
      </section>

      <section>
        <CollapsibleSection title="Recent usage" count={usage.length}>
          <UsageTable logs={usage} />
        </CollapsibleSection>
      </section>
    </main>
  );
}