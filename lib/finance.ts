import { SupplierType, WeekItem } from '@prisma/client';

export function linePurchaseCents(item: WeekItem) {
  const cost = item.actualUnitCostCents ?? item.pricePerUnitCents ?? 0;
  const qty = Number(item.receivedQty ?? 0);
  return Math.round(cost * qty);
}

export function calcMetrics(args: {
  openingStockValueCents: number;
  closingStockValueCents: number;
  totalTakingsCents: number;
  wasteValueCents: number;
  weekItems: (WeekItem & { supplier: { type: SupplierType } })[];
}) {
  const cog = args.weekItems.reduce((sum, i) => sum + linePurchaseCents(i), 0);
  const cogs = args.openingStockValueCents + cog - args.closingStockValueCents;
  const grossProfit = args.totalTakingsCents - cogs;
  const grossMargin = args.totalTakingsCents > 0 ? grossProfit / args.totalTakingsCents : 0;
  const cashFlow = args.totalTakingsCents - cog;

  const byType = (type: SupplierType) =>
    args.weekItems.filter((i) => i.supplier.type === type).reduce((s, i) => s + linePurchaseCents(i), 0);

  return {
    cog,
    cogs,
    grossProfit,
    grossMargin,
    cashFlow,
    wholesaleSpend: byType('WHOLESALER'),
    farmSpend: byType('FARM_ORDER'),
    farmgateSpend: byType('FARMGATE'),
    waste: args.wasteValueCents
  };
}
