import { z } from "zod";

export const regSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(15, { message: "Username must be at most 15 characters long" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(20, { message: "Password must be at most 20 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&]/, {
        message:
          "Password must contain at least one special character (@$!%*?&)",
      }),
    cfmPassword: z
      .string()
      .min(6, {
        message: "Confirm password must be at least 6 characters long",
      })
      .max(20, {
        message: "Confirm password must be at most 20 characters long",
      }),
  })
  .refine((data) => data.password === data.cfmPassword, {
    message: "Passwords do not match",
    path: ["cfmPassword"], // highlights error under confirm password field
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" }),
});

export const categorySchema = z.object({
  categoryName: z
    .string()
    .min(2, { message: "Category name is required" })
    .max(50, { message: "Category name must be at most 50 characters long" }),
  productType: z
    .enum(["product", "service"])
    .refine((val) => !!val, { message: "Please select a product type" }),
  branch: z.string().min(1, { message: "Please select a branch" }),
});

export const productSchema = z.object({
  branch: z.string().min(1, { message: "Please select a branch" }),
  category: z.string().min(1, { message: "Please select a category" }),
  product: z
    .string()
    .min(2, { message: "Product name is required" })
    .max(100, { message: "Product name must be at most 100 characters long" }),
  skuNumber: z
    .string()
    .min(1, { message: "SKU is required" })
    .max(30, { message: "SKU must be at most 30 characters long" }),
  price: z
    .number({ message: "Price must be a number" })
    .min(1, { message: "Price cannot be less than 1" }),
  priceType: z
    .enum(["negotiable", "fixed"])
    .refine((val) => !!val, { message: "Please select a price type" }),
  vat: z.string().optional(),
  description: z.string().optional(),
  image: z.any().optional(),
});
