import { Request, Response } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service";

export const create = async (req: Request, res: Response) => {
  try {
    const { name, description, priceCents, stockQuantity } = req.body;

    const product = await createProduct(
      name,
      description,
      Number(priceCents),
      Number(stockQuantity)
    );

    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const products = await getAllProducts();

    res.json(products);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, description, priceCents, stockQuantity } = req.body;

    const product = await updateProduct(
      id,
      name,
      description,
      Number(priceCents),
      Number(stockQuantity)
    );

    res.json(product);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await deleteProduct(id);

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
