-- CreateEnum
CREATE TYPE "WeekStatus" AS ENUM ('planning', 'ordering', 'received', 'closed');
CREATE TYPE "SupplierType" AS ENUM ('WHOLESALER', 'FARMGATE', 'FARM_ORDER');
CREATE TYPE "ItemStatus" AS ENUM ('planned', 'ordered', 'received', 'stocked');
CREATE TYPE "Unit" AS ENUM ('kg', 'ea', 'box', 'bunch', 'punnet', 'litre');

CREATE TABLE "Week" (
    "id" TEXT NOT NULL,
    "weekStartDate" TIMESTAMP(3) NOT NULL,
    "openingStockValueCents" INTEGER NOT NULL DEFAULT 0,
    "closingStockValueCents" INTEGER,
    "totalTakingsCents" INTEGER NOT NULL DEFAULT 0,
    "wasteValueCents" INTEGER NOT NULL DEFAULT 0,
    "status" "WeekStatus" NOT NULL DEFAULT 'planning',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Week_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SupplierType" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defaultUnit" "Unit" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WeekItem" (
    "id" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "plannedQty" DECIMAL(10,2),
    "plannedUnit" "Unit",
    "orderedQty" DECIMAL(10,2),
    "orderedUnit" "Unit",
    "pricePerUnitCents" INTEGER,
    "receivedQty" DECIMAL(10,2),
    "receivedUnit" "Unit",
    "actualUnitCostCents" INTEGER,
    "wasteQty" DECIMAL(10,2),
    "wasteUnit" "Unit",
    "status" "ItemStatus" NOT NULL DEFAULT 'planned',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "WeekItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Week_weekStartDate_key" ON "Week"("weekStartDate");
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");
CREATE INDEX "WeekItem_weekId_supplierId_sortOrder_idx" ON "WeekItem"("weekId", "supplierId", "sortOrder");

ALTER TABLE "WeekItem" ADD CONSTRAINT "WeekItem_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WeekItem" ADD CONSTRAINT "WeekItem_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WeekItem" ADD CONSTRAINT "WeekItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
