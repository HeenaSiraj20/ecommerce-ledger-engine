import { body } from "express-validator";

export const createProductValidation = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required"),

  body("priceCents")
    .isInt({ min: 1 })
    .withMessage("Price must be greater than 0"),

  body("stockQuantity")
    .isInt({ min: 0 })
    .withMessage("Stock cannot be negative"),
];