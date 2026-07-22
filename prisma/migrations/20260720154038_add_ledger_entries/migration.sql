-- CreateEnum
CREATE TYPE "LedgerAccount" AS ENUM ('CASH', 'REVENUE', 'REFUNDS_PAYABLE', 'INVENTORY');

-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "account" "LedgerAccount" NOT NULL,
    "entryType" "EntryType" NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
