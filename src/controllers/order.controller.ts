import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import {
  createOrder,
  getOrdersByUser,
  getOrder,
  getAllOrders,
  payOrder,
  cancelOrder,
  refundOrder,
} from "../services/order.service";

export const create = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    const order = await createOrder(
      req.user!.id,
      productId,
      Number(quantity)
    );

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await getOrdersByUser(req.user!.id);
  res.json(orders);
});

export const getAll = asyncHandler(async (req, res) => {
  const orders = await getAllOrders();
  res.json(orders);
});

export const getOne = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

const order = await getOrder(
  id,
  req.user!.id
);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const pay = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const order = await payOrder(
      id,
      req.user!.id
    );

    res.json(order);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const cancel = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const order = await cancelOrder(
      id,
      req.user!.id
    );

    res.json(order);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export const refund = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const order = await refundOrder(
      id,
      req.user!.id
    );

    res.json(order);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};