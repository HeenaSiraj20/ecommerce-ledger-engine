import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import reportRoutes from "./routes/report.routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Ecommerce Ledger Engine API is running 🚀",
  });
});

export default app;