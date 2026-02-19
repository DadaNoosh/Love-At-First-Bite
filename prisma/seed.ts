import { Prisma, SupplierType, Unit } from '@prisma/client';
import { startOfWeek } from 'date-fns';
import { prisma } from '../lib/prisma';

async function main() {
  const weekStartDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const week = await prisma.week.upsert({
    where: { weekStartDate },
    update: {},
    create: { weekStartDate, openingStockValueCents: 50000 }
  });

  const suppliers = await Promise.all([
    prisma.supplier.upsert({ where: { name: 'Sydney Wholesale' }, update: {}, create: { name: 'Sydney Wholesale', type: SupplierType.WHOLESALER } }),
    prisma.supplier.upsert({ where: { name: 'Moss Vale Farmgate' }, update: {}, create: { name: 'Moss Vale Farmgate', type: SupplierType.FARMGATE } }),
    prisma.supplier.upsert({ where: { name: 'Orange Family Farm' }, update: {}, create: { name: 'Orange Family Farm', type: SupplierType.FARM_ORDER } })
  ]);

  const items = await Promise.all([
    prisma.item.upsert({ where: { name: 'Tomatoes' }, update: {}, create: { name: 'Tomatoes', defaultUnit: Unit.kg, category: 'veg' } }),
    prisma.item.upsert({ where: { name: 'Strawberries' }, update: {}, create: { name: 'Strawberries', defaultUnit: Unit.punnet, category: 'fruit' } }),
    prisma.item.upsert({ where: { name: 'Spinach' }, update: {}, create: { name: 'Spinach', defaultUnit: Unit.bunch, category: 'veg' } })
  ]);

  await prisma.weekItem.createMany({
    data: [
      { weekId: week.id, supplierId: suppliers[0].id, itemId: items[0].id, plannedQty: new Prisma.Decimal(12), plannedUnit: Unit.kg, orderedQty: new Prisma.Decimal(12), orderedUnit: Unit.kg, pricePerUnitCents: 620, status: 'ordered', sortOrder: 0 },
      { weekId: week.id, supplierId: suppliers[1].id, itemId: items[1].id, plannedQty: new Prisma.Decimal(8), plannedUnit: Unit.punnet, status: 'planned', sortOrder: 0 },
      { weekId: week.id, supplierId: suppliers[2].id, itemId: items[2].id, plannedQty: new Prisma.Decimal(15), plannedUnit: Unit.bunch, orderedQty: new Prisma.Decimal(15), orderedUnit: Unit.bunch, pricePerUnitCents: 280, receivedQty: new Prisma.Decimal(14), receivedUnit: Unit.bunch, status: 'received', sortOrder: 0 }
    ],
    skipDuplicates: true
  });
}

main().finally(() => prisma.$disconnect());
