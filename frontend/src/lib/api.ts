import type { Entry, UsageLog, FilterParams } from '@/types/entry';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function fetchEntries(params: FilterParams): Promise<Entry[]> {
  const query = new URLSearchParams({
    words: String(params.words),
    operator: params.operator,
    sortBy: params.sortBy,
    order: params.order,
  });

  const res = await fetch(`${API_URL}/entries?${query}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch entries: ${res.status}`);
  }

  return res.json();
}

export async function fetchUsage(): Promise<UsageLog[]> {
  const res = await fetch(`${API_URL}/usage`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch usage: ${res.status}`);
  }

  return res.json();
}