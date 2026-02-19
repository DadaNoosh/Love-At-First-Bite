import { addPlanItemAction } from '@/app/actions';
import { WeekNav } from '@/components/week-nav';
import { getWeekWithItems } from '@/lib/data';
import { prisma } from '@/lib/prisma';

export default async function PlanPage({ params }: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await params;
  const [week, suppliers, items] = await Promise.all([
    getWeekWithItems(weekId),
    prisma.supplier.findMany({ where: { active: true }, orderBy: { name: 'asc' } }),
    prisma.item.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
  ]);

  return (
    <div className="space-y-4">
      <WeekNav weekId={weekId} active="plan" />
      {week.status === 'closed' && <p className="rounded bg-amber-100 p-2 text-sm">Week is closed. Unlock in Stock to edit.</p>}
      <form action={addPlanItemAction} className="grid grid-cols-2 gap-2 rounded-xl bg-white p-3 shadow-sm md:grid-cols-5">
        <input type="hidden" name="weekId" value={weekId} />
        <select name="supplierId">{suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        <select name="itemId">{items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</select>
        <input name="plannedQty" type="number" step="0.01" placeholder="Qty" />
        <select name="plannedUnit">{['kg','ea','box','bunch','punnet','litre'].map((u) => <option key={u}>{u}</option>)}</select>
        <button type="submit" className="bg-slate-900 text-white">Add item</button>
      </form>
      <div className="rounded-xl bg-white p-3 shadow-sm">
        {week.weekItems.map((line) => (
          <div key={line.id} className="border-b py-2 text-sm">
            <b>{line.supplier.name}</b> - {line.item.name} | {String(line.plannedQty ?? '')} {line.plannedUnit}
          </div>
        ))}
      </div>
    </div>
  );
}
