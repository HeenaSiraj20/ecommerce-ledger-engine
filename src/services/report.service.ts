import prisma from "../config/db";

export const revenueReport = async () => {
  const result = await prisma.$queryRawUnsafe(`
    SELECT
      account,
      SUM("amountCents") AS total
    FROM "LedgerEntry"
    GROUP BY account
    ORDER BY account;
  `);

  return (result as any[]).map((row) => ({
    account: row.account,
    total: Number(row.total),
  }));
};