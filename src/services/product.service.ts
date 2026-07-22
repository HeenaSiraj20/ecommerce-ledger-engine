import prisma from "../config/db";

export const createProduct = async (
  name: string,
  description: string,
  priceCents: number,
  stockQuantity: number
) => {
  return prisma.product.create({
    data: {
      name,
      description,
      priceCents,
      stockQuantity,
    },
  });
};

export const getAllProducts = async () => {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
  });
};

export const updateProduct = async (
  id: string,
  name: string,
  description: string,
  priceCents: number,
  stockQuantity: number
) => {
  return prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      priceCents,
      stockQuantity,
    },
  });
};

export const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};