import { ReactNode } from 'react';
import { WeekNav } from '@/components/week-nav';
import { WeekSelector } from '@/components/week-selector';
import { prisma } from '@/lib/prisma';

export default async function WeekLayout({ children, params }: { children: ReactNode; params: Promise<{ weekId: string }> }) {
  const { weekId } = await params;
  const week = await prisma.week.findUniqueOrThrow({ where: { id: weekId } });

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 p-4">
      <WeekSelector weekStartDate={week.weekStartDate} />
      <WeekNav weekId={weekId} active="" />
      {children}
    </main>
  );
}
