import bcrypt from "bcryptjs";
import prisma from "../config/db";
import { generateToken } from "../utils/jwt";

export const registerUser = async (
  email: string,
  password: string,
  role: "CUSTOMER" | "ADMIN" = "CUSTOMER"
) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      role,
    },
  });

  // Generate JWT
  const token = generateToken(user.id, user.role);

  // Remove password hash
  const { passwordHash, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
};

export const loginUser = async (
  email: string,
  password: string
) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const token = generateToken(user.id, user.role);

  // Remove password hash
  const { passwordHash, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
};