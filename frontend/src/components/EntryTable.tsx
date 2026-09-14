import type { Entry } from '@/types/entry';

interface Props {
  entries: Entry[];
}

export function EntryTable({ entries }: Props) {
  

    if (entries.length === 0) {
    return (
        <div className="rounded border border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-gray-600">
            No entries match the current filter.
        </p>
        <p className="mt-1 text-sm text-gray-500">
            Try adjusting the word count or operator.
        </p>
        </div>
    );
    }
  return (
    
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b bg-gray-100">
          <th className="p-2 text-left">#</th>
          <th className="p-2 text-left">Title</th>
          <th className="p-2 text-right">Points</th>
          <th className="p-2 text-right">Comments</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.number} className="border-b hover:bg-gray-50">
            <td className="p-2">{entry.number}</td>
            <td className="p-2">{entry.title}</td>
            <td className="p-2 text-right">{entry.points}</td>
            <td className="p-2 text-right">{entry.comments}</td>
          </tr>
        ))}
      </tbody>
      
    </table>
  );
}