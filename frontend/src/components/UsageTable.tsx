import type { UsageLog } from '@/types/entry';

interface Props {
  logs: UsageLog[];
}

export function UsageTable({ logs }: Props) {
  if (logs.length === 0) {
    return <p className="text-gray-500">No usage logs yet.</p>;
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b bg-gray-100">
          <th className="p-2 text-left">Time</th>
          <th className="p-2 text-left">Filter</th>
          <th className="p-2 text-right">Entries</th>
          <th className="p-2 text-right">ms</th>
          <th className="p-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id} className="border-b hover:bg-gray-50">
            <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
            <td className="p-2 font-mono text-xs">{log.filter}</td>
            <td className="p-2 text-right">{log.entriesReturned}</td>
            <td className="p-2 text-right">{log.executionMs}</td>
            <td className="p-2">{log.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}