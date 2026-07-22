import crypto from "crypto";
import { PrismaClient, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrder = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  return await prisma.$transaction(async (tx) => {
    // Find product
    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Check stock
    if (product.stockQuantity < quantity) {
      throw new Error("Insufficient stock");
    }

    // Calculate total
    const total = product.priceCents * quantity;

    // Create order
    const order = await tx.order.create({
      data: {
        userId,
        status: OrderStatus.PENDING,
        totalAmountCents: total,
        idempotencyKey: crypto.randomUUID(),
      },
    });

    // Create order item
    await tx.orderItem.create({
      data: {
        orderId: order.id,
        productId,
        quantity,
        unitPriceCents: product.priceCents,
      },
    });

    // Reduce inventory
    await tx.product.update({
      where: { id: product.id },
      data: {
        stockQuantity: {
          decrement: quantity,
        },
      },
    });

    // Ledger entries
    await tx.ledgerEntry.createMany({
      data: [
        {
          orderId: order.id,
          account: "CASH",
          entryType: "DEBIT",
          amountCents: total,
          description: "Customer payment",
        },
        {
          orderId: order.id,
          account: "REVENUE",
          entryType: "CREDIT",
          amountCents: total,
          description: "Revenue earned",
        },
      ],
    });

    return order;
  });
};

export const getOrdersByUser = async (userId: string) => {
  return await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      ledgerEntries: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getOrder = async (
  orderId: string,
  userId: string
) => {
  return await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      ledgerEntries: true,
    },
  });
};
export const payOrder = async (
  orderId: string,
  userId: string
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status === "PAID") {
    throw new Error("Order already paid");
  }

  return await prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      status: OrderStatus.PAID,
    },
  });
};
export const cancelOrder = async (
  orderId: string,
  userId: string
) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.PAID) {
      throw new Error("Paid orders cannot be cancelled");
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new Error("Order already cancelled");
    }

    // Restore inventory
    for (const item of order.items) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stockQuantity: {
            increment: item.quantity,
          },
        },
      });
    }

    // Update order status
    return await tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: OrderStatus.CANCELLED,
      },
    });
  });
};
export const refundOrder = async (
  orderId: string,
  userId: string
) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== OrderStatus.PAID) {
      throw new Error("Only paid orders can be refunded");
    }

    // Restore inventory
    for (const item of order.items) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stockQuantity: {
            increment: item.quantity,
          },
        },
      });
    }

    // Reverse ledger entries
    await tx.ledgerEntry.createMany({
      data: [
        {
          orderId: order.id,
          account: "REVENUE",
          entryType: "DEBIT",
          amountCents: order.totalAmountCents,
          description: "Refund issued",
        },
        {
          orderId: order.id,
          account: "CASH",
          entryType: "CREDIT",
          amountCents: order.totalAmountCents,
          description: "Cash returned",
        },
      ],
    });

    return await tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: OrderStatus.REFUNDED,
      },
    });
  });
};
export const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
      ledgerEntries: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
