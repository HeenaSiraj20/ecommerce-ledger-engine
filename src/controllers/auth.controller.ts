import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const {
  email,
  password,
  role,
} = req.body;

const result = await registerUser(
  email,
  password,
  role
);

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.json(result);
  } catch (error: any) {
    res.status(401).json({
      message: error.message,
    });
  }
};