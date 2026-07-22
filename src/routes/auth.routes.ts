import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/test", (req, res) => {
  res.json({ message: "Auth route works!" });
});
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: heena@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;