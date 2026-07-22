import { Request, Response } from "express";
import { revenueReport } from "../services/report.service";

export const getRevenueReport = async (
  req: Request,
  res: Response
) => {
  try {
    const report = await revenueReport();

    res.json(report);
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};