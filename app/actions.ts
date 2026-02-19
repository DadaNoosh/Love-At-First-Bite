'use server';

import { ItemStatus, Prisma, WeekStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn, signOut } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { mondayOf } from '@/lib/utils';
import { itemSchema, orderSchema, receiveSchema, stockSchema, supplierSchema, weekItemPlanSchema } from '@/lib/validations';

export async function loginAction(formData: FormData) {
  await signIn('credentials', { password: formData.get('password'), redirectTo: '/' });
}

export async function logoutAction() {
  await signOut({ redirectTo: '/login' });
}

export async function createWeekAction(formData: FormData) {
  const rawDate = String(formData.get('date') ?? new Date().toISOString());
  const weekStartDate = mondayOf(new Date(rawDate));
  const existing = await prisma.week.findUnique({ where: { weekStartDate } });
  const week =
    existing ?? (await prisma.week.create({ data: { weekStartDate, status: WeekStatus.planning, openingStockValueCents: 0 } }));
  redirect(`/week/${week.id}/plan`);
}

export async function addPlanItemAction(formData: FormData) {
  const parsed = weekItemPlanSchema.parse(Object.fromEntries(formData));
  const sortOrder = await prisma.weekItem.count({ where: { weekId: parsed.weekId, supplierId: parsed.supplierId } });
  await prisma.weekItem.create({
    data: {
      ...parsed,
      plannedQty: new Prisma.Decimal(parsed.plannedQty),
      status: ItemStatus.planned,
      sortOrder
    }
  });
  revalidatePath(`/week/${parsed.weekId}/plan`);
}

export async function updateOrderAction(formData: FormData) {
  const parsed = orderSchema.parse(Object.fromEntries(formData));
  const existing = await prisma.weekItem.findUniqueOrThrow({ where: { id: parsed.id } });
  await prisma.weekItem.update({
    where: { id: parsed.id },
    data: {
      orderedQty: new Prisma.Decimal(parsed.orderedQty),
      orderedUnit: parsed.orderedUnit,
      pricePerUnitCents: parsed.pricePerUnitCents,
      status: parsed.ordered ? ItemStatus.ordered : existing.status
    }
  });
  revalidatePath(`/week/${existing.weekId}/order`);
}

export async function updateReceiveAction(formData: FormData) {
  const parsed = receiveSchema.parse(Object.fromEntries(formData));
  const existing = await prisma.weekItem.findUniqueOrThrow({ where: { id: parsed.id } });
  await prisma.weekItem.update({
    where: { id: parsed.id },
    data: {
      receivedQty: new Prisma.Decimal(parsed.receivedQty),
      receivedUnit: parsed.receivedUnit,
      actualUnitCostCents: parsed.actualUnitCostCents,
      status: ItemStatus.received
    }
  });
  revalidatePath(`/week/${existing.weekId}/received`);
}

export async function updateStockAction(formData: FormData) {
  const parsed = stockSchema.parse(Object.fromEntries(formData));
  await prisma.week.update({
    where: { id: parsed.weekId },
    data: {
      closingStockValueCents: parsed.closingStockValueCents,
      totalTakingsCents: parsed.totalTakingsCents,
      wasteValueCents: parsed.wasteValueCents,
      status: WeekStatus.closed
    }
  });
  await prisma.weekItem.updateMany({ where: { weekId: parsed.weekId, status: ItemStatus.received }, data: { status: ItemStatus.stocked } });
  revalidatePath('/');
  revalidatePath(`/week/${parsed.weekId}/stock`);
}

export async function unlockWeekAction(formData: FormData) {
  const weekId = String(formData.get('weekId'));
  await prisma.week.update({ where: { id: weekId }, data: { status: WeekStatus.received } });
  revalidatePath(`/week/${weekId}/stock`);
}

export async function addSupplierAction(formData: FormData) {
  const parsed = supplierSchema.parse(Object.fromEntries(formData));
  await prisma.supplier.create({ data: parsed });
  revalidatePath('/suppliers-products');
}

export async function addItemAction(formData: FormData) {
  const parsed = itemSchema.parse(Object.fromEntries(formData));
  await prisma.item.create({ data: parsed });
  revalidatePath('/suppliers-products');
}
