import { Router } from "express";
import { getRevenueReport } from "../controllers/report.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

router.get(
  "/revenue",
  authenticate,
  authorize("ADMIN"),
  getRevenueReport
);
export default router;
