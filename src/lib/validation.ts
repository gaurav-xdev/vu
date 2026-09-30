import { z } from "zod";

// ─── Common ───────────────────────────────────────────────────────────────────

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .max(255, "Email too long")
  .transform((v) => v.toLowerCase());

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const displayNameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(60, "Name too long")
  .regex(/^[a-zA-Z0-9\s\-_.]+$/, "Name contains invalid characters");

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: displayNameSchema.optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required").max(128),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1).max(256),
  password: passwordSchema,
});

// ─── Waitlist Schema ──────────────────────────────────────────────────────────

export const waitlistSchema = z.object({
  email: emailSchema,
  name: z.string().trim().max(60).optional(),
  useCase: z.string().trim().max(500).optional(),
});

// ─── Profile Schema ───────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  displayName: displayNameSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: passwordSchema,
});

// ─── Type Exports ──────────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type WaitlistInput = z.infer<typeof waitlistSchema>;
