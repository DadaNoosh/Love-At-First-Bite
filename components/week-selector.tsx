import { addDays, format } from 'date-fns';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export async function WeekSelector({ weekStartDate }: { weekStartDate: Date }) {
  const prev = await prisma.week.findUnique({ where: { weekStartDate: addDays(weekStartDate, -7) } });
  const next = await prisma.week.findUnique({ where: { weekStartDate: addDays(weekStartDate, 7) } });

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
      <Link href={prev ? `/week/${prev.id}/plan` : '#'} className="border px-3 py-1">
        Previous
      </Link>
      <div className="font-semibold">{format(weekStartDate, 'EEE dd MMM yyyy')}</div>
      <Link href={next ? `/week/${next.id}/plan` : '#'} className="border px-3 py-1">
        Next
      </Link>
    </div>
  );
}
