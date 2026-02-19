import Link from 'next/link';
import { addItemAction, addSupplierAction } from '@/app/actions';
import { prisma } from '@/lib/prisma';

export default async function SuppliersProductsPage() {
  const [suppliers, items] = await Promise.all([
    prisma.supplier.findMany({ orderBy: { name: 'asc' } }),
    prisma.item.findMany({ orderBy: { name: 'asc' } })
  ]);

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-4">
      <Link href="/" className="text-sm underline">← Dashboard</Link>
      <h1 className="text-xl font-bold">Suppliers & Products</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <form action={addSupplierAction} className="space-y-2 rounded-xl bg-white p-4 shadow-sm">
          <h2 className="font-semibold">Add Supplier</h2>
          <input name="name" placeholder="Name" className="w-full" />
          <select name="type" className="w-full">{['WHOLESALER','FARMGATE','FARM_ORDER'].map((t)=><option key={t}>{t}</option>)}</select>
          <label className="flex gap-2 text-sm"><input type="checkbox" name="active" defaultChecked value="true" />Active</label>
          <button className="bg-slate-900 text-white">Save Supplier</button>
          <div className="text-sm">{suppliers.map((s) => <div key={s.id}>{s.name} ({s.type})</div>)}</div>
        </form>

        <form action={addItemAction} className="space-y-2 rounded-xl bg-white p-4 shadow-sm">
          <h2 className="font-semibold">Add Product</h2>
          <input name="name" placeholder="Name" className="w-full" />
          <select name="defaultUnit" className="w-full">{['kg','ea','box','bunch','punnet','litre'].map((u)=><option key={u}>{u}</option>)}</select>
          <input name="category" placeholder="Category (optional)" className="w-full" />
          <label className="flex gap-2 text-sm"><input type="checkbox" name="active" defaultChecked value="true" />Active</label>
          <button className="bg-slate-900 text-white">Save Product</button>
          <div className="text-sm">{items.map((i) => <div key={i.id}>{i.name} ({i.defaultUnit})</div>)}</div>
        </form>
      </div>
    </main>
  );
}
