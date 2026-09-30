import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const planEnum = pgEnum("plan", ["free", "pro", "enterprise"]);
export const sessionStatusEnum = pgEnum("session_status", ["active", "revoked", "expired"]);
export const auditActionEnum = pgEnum("audit_action", [
  "user.register",
  "user.login",
  "user.logout",
  "user.password_changed",
  "user.email_verified",
  "user.deleted",
  "session.revoked",
  "billing.subscription_created",
  "billing.subscription_cancelled",
  "billing.payment_succeeded",
  "billing.payment_failed",
  "waitlist.joined",
]);

// ─── Users ─────────────────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    displayName: text("display_name"),
    emailVerified: boolean("email_verified").default(false).notNull(),
    emailVerifyToken: text("email_verify_token"),
    emailVerifyTokenExpiry: timestamp("email_verify_token_expiry"),
    passwordResetToken: text("password_reset_token"),
    passwordResetTokenExpiry: timestamp("password_reset_token_expiry"),
    plan: planEnum("plan").default("free").notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    subscriptionStatus: text("subscription_status"),
    subscriptionCurrentPeriodEnd: timestamp("subscription_current_period_end"),
    failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
    lockedUntil: timestamp("locked_until"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [
    uniqueIndex("users_email_idx").on(t.email),
    index("users_stripe_customer_idx").on(t.stripeCustomerId),
  ]
);

// ─── Sessions ──────────────────────────────────────────────────────────────────

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    status: sessionStatusEnum("status").default("active").notNull(),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    revokedAt: timestamp("revoked_at"),
  },
  (t) => [
    index("sessions_user_id_idx").on(t.userId),
    uniqueIndex("sessions_token_hash_idx").on(t.tokenHash),
  ]
);

// ─── Audit Log ─────────────────────────────────────────────────────────────────

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    action: auditActionEnum("action").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    metadata: text("metadata"), // JSON string, no sensitive data
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("audit_logs_user_id_idx").on(t.userId),
    index("audit_logs_action_idx").on(t.action),
    index("audit_logs_created_at_idx").on(t.createdAt),
  ]
);

// ─── Waitlist ──────────────────────────────────────────────────────────────────

export const waitlist = pgTable(
  "waitlist",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name"),
    useCase: text("use_case"),
    referrer: text("referrer"),
    position: integer("position"),
    invited: boolean("invited").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("waitlist_email_idx").on(t.email)]
);

// ─── Rate Limit Store (DB-based fallback) ──────────────────────────────────────

export const rateLimitStore = pgTable(
  "rate_limit_store",
  {
    key: text("key").primaryKey(),
    count: integer("count").default(0).notNull(),
    resetAt: timestamp("reset_at").notNull(),
  }
);

// ─── Stripe Webhook Events (idempotency) ──────────────────────────────────────

export const stripeEvents = pgTable(
  "stripe_events",
  {
    id: text("id").primaryKey(), // Stripe event ID
    type: text("type").notNull(),
    processed: boolean("processed").default(false).notNull(),
    processedAt: timestamp("processed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);

// ─── Types ─────────────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type WaitlistEntry = typeof waitlist.$inferSelect;
