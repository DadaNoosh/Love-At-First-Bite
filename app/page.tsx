import Link from 'next/link';
import { createWeekAction } from '@/app/actions';
import { auth } from '@/lib/auth';
import { getDashboard, getOrCreateCurrentWeek } from '@/lib/data';
import { centsToDollars } from '@/lib/utils';

export default async function Home() {
  const session = await auth();
  if (!session) return <div className="p-6"><Link href="/login">Login</Link></div>;

  const currentWeek = await getOrCreateCurrentWeek();
  const data = await getDashboard(currentWeek.id);

  const tile = (label: string, value: string) => (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Link className="rounded-lg bg-slate-900 px-4 py-2 text-white" href={`/week/${currentWeek.id}/plan`}>Open Week: {data.weekLabel}</Link>
        <form action={createWeekAction} className="flex gap-2">
          <input type="date" name="date" />
          <button className="bg-white border" type="submit">Create Week</button>
        </form>
      </div>
      <h1 className="text-xl font-bold">Financial Report</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tile('COG', centsToDollars(data.weekly.cog))}
        {tile('TOTAL TAKINGS', centsToDollars(data.week.totalTakingsCents))}
        {tile('COGS', centsToDollars(data.weekly.cogs))}
        {tile('GROSS PROFIT', centsToDollars(data.weekly.grossProfit))}
        {tile('GROSS MARGIN', `${(data.weekly.grossMargin * 100).toFixed(1)}%`)}
        {tile('CASH FLOW', centsToDollars(data.weekly.cashFlow))}
        {tile('WHOLESALE SPEND', centsToDollars(data.weekly.wholesaleSpend))}
        {tile('FARM SPEND', centsToDollars(data.weekly.farmSpend))}
        {tile('FARMGATE SPEND', centsToDollars(data.weekly.farmgateSpend))}
        {tile('WASTE', centsToDollars(data.weekly.waste))}
        {tile('GP (MONTH)', centsToDollars(data.month.gp))}
        {tile('GM% (MONTH)', `${(data.month.gm * 100).toFixed(1)}%`)}
        {tile('GP (QUARTER)', centsToDollars(data.quarter.gp))}
        {tile('GM% (QUARTER)', `${(data.quarter.gm * 100).toFixed(1)}%`)}
        {tile('GP (YEAR)', centsToDollars(data.year.gp))}
        {tile('GM% (YEAR)', `${(data.year.gm * 100).toFixed(1)}%`)}
      </div>
    </main>
  );
}
