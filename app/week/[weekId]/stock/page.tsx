import { unlockWeekAction, updateStockAction } from '@/app/actions';
import { WeekNav } from '@/components/week-nav';
import { getWeekWithItems } from '@/lib/data';

export default async function StockPage({ params }: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await params;
  const week = await getWeekWithItems(weekId);

  return (
    <div className="space-y-4">
      <WeekNav weekId={weekId} active="stock" />
      <form action={updateStockAction} className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
        <input type="hidden" name="weekId" value={weekId} />
        <label className="block text-sm">Total Takings (cents)<input className="w-full" name="totalTakingsCents" type="number" defaultValue={week.totalTakingsCents} /></label>
        <label className="block text-sm">Closing Stock Value (cents)<input className="w-full" name="closingStockValueCents" type="number" defaultValue={week.closingStockValueCents ?? 0} /></label>
        <label className="block text-sm">Waste Value (cents)<input className="w-full" name="wasteValueCents" type="number" defaultValue={week.wasteValueCents} /></label>
        <button className="bg-slate-900 text-white">Close week</button>
      </form>
      {week.status === 'closed' && (
        <form action={unlockWeekAction}>
          <input type="hidden" name="weekId" value={weekId} />
          <button className="bg-amber-500 text-white">Unlock week</button>
        </form>
      )}
    </div>
  );
}
