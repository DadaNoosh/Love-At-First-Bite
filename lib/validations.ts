import { SupplierType, Unit } from '@prisma/client';
import { z } from 'zod';

export const weekItemPlanSchema = z.object({
  weekId: z.string().cuid(),
  supplierId: z.string().cuid(),
  itemId: z.string().cuid(),
  plannedQty: z.coerce.number().positive(),
  plannedUnit: z.nativeEnum(Unit)
});

export const orderSchema = z.object({
  id: z.string().cuid(),
  orderedQty: z.coerce.number().positive(),
  orderedUnit: z.nativeEnum(Unit),
  pricePerUnitCents: z.coerce.number().int().min(0),
  ordered: z.boolean()
});

export const receiveSchema = z.object({
  id: z.string().cuid(),
  receivedQty: z.coerce.number().positive(),
  receivedUnit: z.nativeEnum(Unit),
  actualUnitCostCents: z.coerce.number().int().min(0).optional()
});

export const stockSchema = z.object({
  weekId: z.string().cuid(),
  closingStockValueCents: z.coerce.number().int().min(0),
  totalTakingsCents: z.coerce.number().int().min(0),
  wasteValueCents: z.coerce.number().int().min(0)
});

export const supplierSchema = z.object({
  name: z.string().min(2),
  type: z.nativeEnum(SupplierType),
  active: z.coerce.boolean()
});

export const itemSchema = z.object({
  name: z.string().min(2),
  defaultUnit: z.nativeEnum(Unit),
  active: z.coerce.boolean(),
  category: z.string().optional()
});
