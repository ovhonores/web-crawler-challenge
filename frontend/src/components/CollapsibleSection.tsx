'use client';

import { useState, type ReactNode } from 'react';

interface Props {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({
  title,
  count,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-lg border border-gray-300">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left transition hover:bg-gray-50"
        aria-expanded={open}
      >
        <span className="font-semibold">
          {title}
          {count !== undefined && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({count})
            </span>
          )}
        </span>
        <span className="text-gray-500">{open ? '▲' : '▼'}</span>
      </button>

      {open && <div className="border-t p-4">{children}</div>}
    </section>
  );
}