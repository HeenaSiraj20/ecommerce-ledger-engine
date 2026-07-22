import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - priceCents
 *               - stockQuantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 16
 *               description:
 *                 type: string
 *                 example: Apple flagship phone
 *               priceCents:
 *                 type: integer
 *                 example: 99999
 *               stockQuantity:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  productController.create
);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Returns all products
 */
router.get("/", productController.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/:id", productController.getOne);
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  productController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  productController.remove
);

export default router;