import Link from 'next/link';

const tabs = [
  { key: 'plan', label: 'PLAN' },
  { key: 'order', label: 'ORDER' },
  { key: 'received', label: 'RECEIVED' },
  { key: 'stock', label: 'STOCK' }
];

export function WeekNav({ weekId, active }: { weekId: string; active: string }) {
  return (
    <div className="grid grid-cols-2 gap-2 md:flex">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={`/week/${weekId}/${tab.key}`}
          className={`rounded-lg border px-3 py-2 text-center text-xs font-semibold ${
            active === tab.key ? 'bg-slate-900 text-white' : 'bg-white'
          }`}
        >
          {tab.label}
        </Link>
      ))}
      <Link href="/suppliers-products" className="rounded-lg border bg-white px-3 py-2 text-center text-xs font-semibold">
        SUPPLIERS & PRODUCTS
      </Link>
    </div>
  );
}
