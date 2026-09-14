import { fetchEntries, fetchUsage } from '@/lib/api';
import { FILTER_MORE_THAN_5_WORDS } from '@/lib/constants';
import { HomeClient } from '@/components/HomeClient';

export default async function Home() {
  const [entries, usage] = await Promise.all([
    fetchEntries(FILTER_MORE_THAN_5_WORDS),
    fetchUsage(),
  ]);

  return (
    <HomeClient
      initialEntries={entries}
      initialUsage={usage}
      initialFilter={FILTER_MORE_THAN_5_WORDS}
    />
  );
}