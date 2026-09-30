"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import {
  LogOut,
  Settings,
  Home,
  Zap,
  Shield,
  CreditCard,
  ChevronRight,
  Activity,
  Download,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  displayName: string | null;
  emailVerified: boolean;
  plan: "free" | "pro" | "enterprise";
  createdAt: Date;
}

interface DashboardClientProps {
  user: User;
}

const planBadgeVariant: Record<string, "default" | "accent" | "success"> = {
  free: "default",
  pro: "accent",
  enterprise: "success",
};

function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  sublabel?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5",
        accent
          ? "border-[color-mix(in_srgb,var(--color-vx-accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-vx-accent)_6%,transparent)]"
          : "border-[var(--color-vx-border)] bg-[var(--color-vx-raised)]"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold tracking-wide uppercase text-[var(--color-vx-text-muted)]">
          {label}
        </span>
        <Icon
          size={16}
          className={
            accent
              ? "text-[var(--color-vx-accent)]"
              : "text-[var(--color-vx-text-muted)]"
          }
        />
      </div>
      <div className="text-2xl font-bold text-[var(--color-vx-text-primary)] tracking-tight">
        {value}
      </div>
      {sublabel && (
        <p className="text-xs text-[var(--color-vx-text-muted)] mt-1">{sublabel}</p>
      )}
    </div>
  );
}

export function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      success("Signed out", "See you next time.");
      router.push("/");
      router.refresh();
    } catch {
      error("Error", "Failed to sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const displayName = user.displayName ?? user.email.split("@")[0];
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[var(--color-vx-void)]">
      {/* Top nav */}
      <header className="border-b border-[var(--color-vx-border)] bg-[color-mix(in_srgb,var(--color-vx-base)_90%,transparent)] backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-[var(--color-vx-text-muted)] hover:text-[var(--color-vx-text-primary)] transition-colors"
            >
              <Home size={14} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <span
              className="text-[var(--color-vx-border)]"
              aria-hidden="true"
            >
              /
            </span>
            <span className="text-sm font-medium text-[var(--color-vx-text-secondary)]">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={planBadgeVariant[user.plan] ?? "default"}>
              {user.plan}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              loading={loggingOut}
              icon={<LogOut size={14} />}
              aria-label="Sign out"
            >
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12" id="main-content">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="vx-h2 text-[var(--color-vx-text-primary)] mb-1">
            Welcome, {displayName}.
          </h1>
          <p className="text-sm text-[var(--color-vx-text-muted)]">
            VOXY dashboard · Member since {joinDate}
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Plan"
            value={user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
            sublabel={user.plan === "free" ? "Upgrade for unlimited" : "Active"}
            icon={Zap}
            accent={user.plan !== "free"}
          />
          <StatCard
            label="Status"
            value="Beta"
            sublabel="v0.9.2 access"
            icon={Activity}
          />
          <StatCard
            label="Security"
            value={user.emailVerified ? "Verified" : "Unverified"}
            sublabel={user.emailVerified ? "Email confirmed" : "Check your inbox"}
            icon={Shield}
          />
          <StatCard
            label="Billing"
            value={user.plan === "free" ? "Free tier" : "Managed"}
            sublabel="No charges during beta"
            icon={CreditCard}
          />
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main content */}
          <div className="space-y-6">
            {/* Download section */}
            <section
              className="rounded-2xl border border-[var(--color-vx-border)] bg-[var(--color-vx-raised)] p-6"
              aria-labelledby="download-heading"
            >
              <h2
                id="download-heading"
                className="text-base font-semibold text-[var(--color-vx-text-primary)] mb-2"
              >
                VOXY for macOS
              </h2>
              <p className="text-sm text-[var(--color-vx-text-secondary)] mb-5">
                The beta client requires macOS 13 Ventura or later.
                Apple Silicon (M1–M4) is fully supported. Intel Macs
                are supported with reduced inference speed.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Download size={14} />}
                  disabled
                  aria-label="Download for Apple Silicon (coming soon)"
                >
                  Apple Silicon — Coming soon
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Download size={14} />}
                  disabled
                  aria-label="Download for Intel Mac (coming soon)"
                >
                  Intel Mac
                </Button>
              </div>

              <p className="text-xs text-[var(--color-vx-text-muted)] mt-4">
                Download links will appear here when the client is ready for your device.
                You&apos;ll receive an email notification.
              </p>
            </section>

            {/* Account section */}
            <section
              className="rounded-2xl border border-[var(--color-vx-border)] bg-[var(--color-vx-raised)] p-6"
              aria-labelledby="account-heading"
            >
              <h2
                id="account-heading"
                className="text-base font-semibold text-[var(--color-vx-text-primary)] mb-4"
              >
                Account
              </h2>

              <dl className="flex flex-col gap-4">
                <AccountField
                  label="Email"
                  value={user.email}
                  verified={user.emailVerified}
                />
                <div className="h-px bg-[var(--color-vx-border)]" />
                <AccountField
                  label="Display name"
                  value={user.displayName ?? "Not set"}
                  muted={!user.displayName}
                />
                <div className="h-px bg-[var(--color-vx-border)]" />
                <AccountField label="User ID" value={user.id} mono />
                <div className="h-px bg-[var(--color-vx-border)]" />
                <AccountField label="Plan" value={user.plan} />
              </dl>

              <div className="mt-5 pt-5 border-t border-[var(--color-vx-border)]">
                <Link
                  href="/account"
                  className="inline-flex items-center gap-2 text-sm text-[var(--color-vx-accent)] hover:underline"
                >
                  Manage account settings
                  <ChevronRight size={14} />
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <section
              className="rounded-2xl border border-[var(--color-vx-border)] bg-[var(--color-vx-raised)] p-5"
              aria-labelledby="status-heading"
            >
              <h2
                id="status-heading"
                className="text-sm font-semibold text-[var(--color-vx-text-primary)] mb-4"
              >
                Beta status
              </h2>

              <div className="flex flex-col gap-3">
                <StatusLine label="Core engine" status="operational" />
                <StatusLine label="Voice processing" status="operational" />
                <StatusLine label="Context reading" status="beta" />
                <StatusLine label="Multi-app context" status="beta" />
                <StatusLine label="Cloud sync" status="coming" />
                <StatusLine label="Team features" status="coming" />
              </div>
            </section>

            <section
              className="rounded-2xl border border-[var(--color-vx-border)] bg-[var(--color-vx-raised)] p-5"
              aria-labelledby="resources-heading"
            >
              <h2
                id="resources-heading"
                className="text-sm font-semibold text-[var(--color-vx-text-primary)] mb-3"
              >
                Resources
              </h2>
              <nav aria-label="Dashboard resources">
                <ul className="flex flex-col gap-1" role="list">
                  {[
                    { label: "Documentation", href: "/docs", icon: Settings },
                    { label: "Security policy", href: "/security", icon: Shield },
                    { label: "Billing", href: "/billing", icon: CreditCard },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                          "text-sm text-[var(--color-vx-text-secondary)]",
                          "hover:bg-[var(--color-vx-surface)] hover:text-[var(--color-vx-text-primary)]",
                          "transition-colors"
                        )}
                      >
                        <item.icon size={14} className="shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function AccountField({
  label,
  value,
  verified,
  mono,
  muted,
}: {
  label: string;
  value: string;
  verified?: boolean;
  mono?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-xs font-semibold tracking-wide uppercase text-[var(--color-vx-text-muted)] shrink-0 pt-0.5">
        {label}
      </dt>
      <dd className="flex items-center gap-2 text-right">
        <span
          className={cn(
            "text-sm",
            mono ? "font-mono text-xs text-[var(--color-vx-text-muted)] truncate max-w-[160px]" : "",
            muted ? "text-[var(--color-vx-text-muted)] italic" : "text-[var(--color-vx-text-secondary)]"
          )}
          title={mono ? value : undefined}
        >
          {value}
        </span>
        {verified !== undefined && (
          <Badge variant={verified ? "success" : "warning"} className="shrink-0">
            {verified ? "Verified" : "Pending"}
          </Badge>
        )}
      </dd>
    </div>
  );
}

function StatusLine({
  label,
  status,
}: {
  label: string;
  status: "operational" | "beta" | "coming" | "degraded";
}) {
  const config = {
    operational: { color: "bg-[var(--color-vx-success)]", label: "Live", pulse: false },
    beta: { color: "bg-[var(--color-vx-accent)]", label: "Beta", pulse: true },
    coming: { color: "bg-[var(--color-vx-border-hover)]", label: "Soon", pulse: false },
    degraded: { color: "bg-[var(--color-vx-warning)]", label: "Degraded", pulse: true },
  }[status];

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-[var(--color-vx-text-secondary)]">{label}</span>
      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            config.color,
            config.pulse && "animate-pulse"
          )}
          aria-hidden="true"
        />
        <span className="text-[10px] font-mono text-[var(--color-vx-text-muted)]">
          {config.label}
        </span>
      </div>
    </div>
  );
}
