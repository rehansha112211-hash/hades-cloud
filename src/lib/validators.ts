import { z } from "zod";

/**
 * Validation schemas for all user/admin input.
 * Every API route MUST validate input with these before touching the DB.
 */

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format")
  .max(254);

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const planCreateSchema = z.object({
  name: z.string().min(1, "Plan name is required").max(80),
  categoryId: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be >= 0").max(1_000_000),
  duration: z.string().min(1, "Duration is required").max(40),
  ram: z.string().min(1, "RAM is required").max(40),
  storage: z.string().min(1, "Storage is required").max(40),
  storageType: z.string().min(1, "Storage type is required").max(40),
  cpu: z.string().min(1, "CPU is required").max(40),
  processor: z.string().min(1, "Processor is required").max(80),
  isVisible: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const planUpdateSchema = planCreateSchema.partial();

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required").max(60),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export const orderCreateSchema = z.object({
  planId: z.string().min(1),
  customer: z.object({
    name: z.string().min(1, "Name is required").max(120),
    email: emailSchema,
    phone: z.string().max(30).optional(),
  }),
  customerNote: z.string().max(500).optional(),
});

export const customerNoteSchema = z.object({
  customerNote: z.string().max(500).optional(),
});

export const settingsSchema = z.object({
  supportEmail: z.string().max(120).optional(),
  discordUrl: z.string().url().or(z.literal("")).optional(),
  contactPhone: z.string().max(40).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type PlanCreateInput = z.infer<typeof planCreateSchema>;
export type PlanUpdateInput = z.infer<typeof planUpdateSchema>;
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
