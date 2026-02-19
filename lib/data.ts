import { endOfMonth, endOfQuarter, endOfYear, format, startOfMonth, startOfQuarter, startOfYear } from 'date-fns';
import { calcMetrics } from '@/lib/finance';
import { prisma } from '@/lib/prisma';
import { mondayOf } from '@/lib/utils';

export async function getOrCreateCurrentWeek() {
  const weekStartDate = mondayOf(new Date());
  return (
    (await prisma.week.findUnique({ where: { weekStartDate } })) ||
    prisma.week.create({ data: { weekStartDate, openingStockValueCents: 0 } })
  );
}

export async function getWeekWithItems(weekId: string) {
  return prisma.week.findUniqueOrThrow({
    where: { id: weekId },
    include: { weekItems: { include: { supplier: true, item: true }, orderBy: [{ supplier: { name: 'asc' } }, { sortOrder: 'asc' }] } }
  });
}

export async function getDashboard(weekId: string) {
  const week = await getWeekWithItems(weekId);
  const closing = week.closingStockValueCents ?? 0;
  const weekly = calcMetrics({
    openingStockValueCents: week.openingStockValueCents,
    closingStockValueCents: closing,
    totalTakingsCents: week.totalTakingsCents,
    wasteValueCents: week.wasteValueCents,
    weekItems: week.weekItems
  });

  const makeRollup = async (from: Date, to: Date) => {
    const weeks = await prisma.week.findMany({
      where: { weekStartDate: { gte: from, lte: to } },
      include: { weekItems: { include: { supplier: true } } }
    });
    const totals = weeks.reduce(
      (acc, w) => {
        const m = calcMetrics({
          openingStockValueCents: w.openingStockValueCents,
          closingStockValueCents: w.closingStockValueCents ?? 0,
          totalTakingsCents: w.totalTakingsCents,
          wasteValueCents: w.wasteValueCents,
          weekItems: w.weekItems
        });
        acc.gp += m.grossProfit;
        acc.takings += w.totalTakingsCents;
        return acc;
      },
      { gp: 0, takings: 0 }
    );
    return { gp: totals.gp, gm: totals.takings > 0 ? totals.gp / totals.takings : 0 };
  };

  const d = week.weekStartDate;
  return {
    week,
    weekLabel: format(d, 'EEE dd MMM yyyy'),
    weekly,
    month: await makeRollup(startOfMonth(d), endOfMonth(d)),
    quarter: await makeRollup(startOfQuarter(d), endOfQuarter(d)),
    year: await makeRollup(startOfYear(d), endOfYear(d))
  };
}
