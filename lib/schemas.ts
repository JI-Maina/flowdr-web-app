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

export const VENDORTYPE = ["INDIVIDUAL", "BUSINESS", "COMPANY", "GOVERNMENT"];

export const vendorSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(15, { message: "Username must be at most 15 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  vendorType: z.enum(VENDORTYPE),
  company: z.string(),
  phone: z
    .string()
    .min(10, { message: "Enter a valid phone number" })
    .regex(/^[0-9+\-\s()]+$/, { message: "Enter a valid phone number" }),
  phoneTwo: z
    .string()
    .min(10, { message: "Enter a valid phone number" })
    .regex(/^[0-9+\-\s()]+$/, { message: "Enter a valid phone number" })
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
});

export const clientSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(15, { message: "Username must be at most 15 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  clientType: z.enum(VENDORTYPE),
  company: z.string(),
  phone: z
    .string()
    .min(10, { message: "Enter a valid phone number" })
    .regex(/^[0-9+\-\s()]+$/, { message: "Enter a valid phone number" }),
  // phoneTwo: z
  //   .string()
  //   .min(10, { message: "Enter a valid phone number" })
  //   .regex(/^[0-9+\-\s()]+$/, { message: "Enter a valid phone number" })
  //   .optional()
  //   .or(z.literal("")),
  branch: z.string().min(1, { message: "Please select a branch" }),
});

export const companySchema = z.object({
  company: z
    .string()
    .min(1, "Company name is required")
    .min(2, "Company name must be at least 2 characters"),
  description: z.string(),
  country: z.string().min(1, "Please select a country"),
  city: z
    .string()
    .min(1, "City is required")
    .min(2, "City must be at least 2 characters"),
  currency: z.string().min(1, "Please select a currency"),
  image: z
    .any()
    .refine((file) => file !== null && file !== undefined, {
      message: "Company logo is required",
    })
    .optional(),
  // image: z
  //   .instanceof(File)
  //   .nullable()
  //   .refine((file) => {
  //     return file !== null;
  //   }, "Company logo is required"),
});
