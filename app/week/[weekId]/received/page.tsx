import { updateReceiveAction } from '@/app/actions';
import { WeekNav } from '@/components/week-nav';
import { getWeekWithItems } from '@/lib/data';

export default async function ReceivedPage({ params }: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await params;
  const week = await getWeekWithItems(weekId);
  return (
    <div className="space-y-4">
      <WeekNav weekId={weekId} active="received" />
      {week.weekItems.filter((i) => i.status !== 'planned').map((line) => (
        <form key={line.id} action={updateReceiveAction} className="grid grid-cols-2 gap-2 rounded-xl bg-white p-3 shadow-sm md:grid-cols-6">
          <input type="hidden" name="id" value={line.id} />
          <div className="col-span-2 text-sm"><b>{line.supplier.name}</b> {line.item.name}</div>
          <input name="receivedQty" type="number" step="0.01" defaultValue={String(line.receivedQty ?? line.orderedQty ?? '')} />
          <select name="receivedUnit" defaultValue={line.receivedUnit ?? line.orderedUnit ?? 'kg'}>{['kg','ea','box','bunch','punnet','litre'].map((u)=><option key={u}>{u}</option>)}</select>
          <input name="actualUnitCostCents" type="number" defaultValue={line.actualUnitCostCents ?? line.pricePerUnitCents ?? ''} />
          <button className="bg-slate-900 text-white">Mark received</button>
        </form>
      ))}
    </div>
  );
}
