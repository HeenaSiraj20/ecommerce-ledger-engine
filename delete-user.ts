import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "heena@example.com";

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("User not found");
    return;
  }

  // Get all orders
  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  const orderIds = orders.map((o) => o.id);

  if (orderIds.length > 0) {
    // Delete Order Items
    await prisma.orderItem.deleteMany({
      where: {
        orderId: {
          in: orderIds,
        },
      },
    });

    // Delete Ledger Entries
    await prisma.ledgerEntry.deleteMany({
      where: {
        orderId: {
          in: orderIds,
        },
      },
    });

    // Delete Orders
    await prisma.order.deleteMany({
      where: {
        id: {
          in: orderIds,
        },
      },
    });
  }

  // Delete User
  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });

  console.log("✅ User deleted successfully.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });