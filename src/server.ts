import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { httpLogger } from "./utils/logger";

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import reportRoutes from "./routes/report.routes";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

import { errorHandler } from "./middlewares/error.middleware";

const app = express();

const PORT = process.env.PORT || 4000;

// --------------------
// Rate Limiter
// --------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// --------------------
// Middlewares
// --------------------
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(httpLogger);

// --------------------
// Root Route
// --------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Ecommerce Ledger Engine API is running 🚀",
  });
});

// --------------------
// API Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);

// --------------------
// Swagger Documentation
// --------------------
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// --------------------
// Global Error Handler
// --------------------
app.use(errorHandler);

// --------------------
// Start Server
// --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;