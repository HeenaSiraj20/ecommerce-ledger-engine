import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createOrderSchema } from "../validators/order.validator";

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post(
  "/",
  authenticate,
  validate(createOrderSchema),
  orderController.create
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 */
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  orderController.getAll
);

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Get my orders
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my orders
 */
router.get(
  "/my",
  authenticate,
  orderController.getMyOrders
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 */
router.get("/:id", authenticate, orderController.getOne);

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   patch:
 *     summary: Pay for an order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order marked as PAID
 */
router.patch("/:id/pay", authenticate, orderController.pay);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel a pending order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 */
router.patch("/:id/cancel", authenticate, orderController.cancel);

/**
 * @swagger
 * /api/orders/{id}/refund:
 *   patch:
 *     summary: Refund a paid order
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order refunded successfully
 */
router.patch("/:id/refund", authenticate, orderController.refund);

export default router;