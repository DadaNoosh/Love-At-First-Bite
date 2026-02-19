import { updateOrderAction } from '@/app/actions';
import { WeekNav } from '@/components/week-nav';
import { getWeekWithItems } from '@/lib/data';

export default async function OrderPage({ params }: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await params;
  const week = await getWeekWithItems(weekId);
  return (
    <div className="space-y-4">
      <WeekNav weekId={weekId} active="order" />
      {week.weekItems.map((line) => (
        <form key={line.id} action={updateOrderAction} className="grid grid-cols-2 gap-2 rounded-xl bg-white p-3 shadow-sm md:grid-cols-6">
          <input type="hidden" name="id" value={line.id} />
          <div className="col-span-2 text-sm"><b>{line.supplier.name}</b> {line.item.name}</div>
          <input name="orderedQty" type="number" defaultValue={String(line.orderedQty ?? line.plannedQty ?? '')} step="0.01" />
          <select name="orderedUnit" defaultValue={line.orderedUnit ?? line.plannedUnit ?? 'kg'}>{['kg','ea','box','bunch','punnet','litre'].map((u)=><option key={u}>{u}</option>)}</select>
          <input name="pricePerUnitCents" type="number" defaultValue={line.pricePerUnitCents ?? ''} placeholder="cents" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="ordered" value="true" defaultChecked={line.status !== 'planned'} />Ordered</label>
          <button className="bg-slate-900 text-white">Save</button>
        </form>
      ))}
    </div>
  );
}
