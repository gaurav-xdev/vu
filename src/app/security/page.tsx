import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Security",
  description: "VOXY security practices and responsible disclosure policy.",
};

const practices = [
  {
    icon: Lock,
    title: "Authentication",
    description:
      "Passwords are hashed with bcrypt (12 rounds). Sessions are cryptographically signed JWTs, stored as HTTP-only cookies. Accounts lock after repeated failed logins. Session tokens are hashed in the database — not stored in plain text.",
  },
  {
    icon: Eye,
    title: "Local-first processing",
    description:
      "Voice processing, context reading, and task execution run entirely on your device. Audio never leaves your machine unless you explicitly enable optional cloud features, which require a separate opt-in.",
  },
  {
    icon: Server,
    title: "Infrastructure",
    description:
      "All API endpoints enforce authentication and authorization server-side. Input is validated via strict schemas. SQL queries use parameterized statements. Rate limiting is applied per IP on all authentication endpoints.",
  },
  {
    icon: Shield,
    title: "Security headers",
    description:
      "All responses include Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy headers. HSTS is enforced in production with a 2-year max-age.",
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-6 py-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-vx-text-muted)] hover:text-[var(--color-vx-text-primary)] transition-colors mb-12"
      >
        <ArrowLeft size={14} />
        Back
      </Link>

      <h1 className="vx-h1 text-[var(--color-vx-text-primary)] mb-3">
        Security
      </h1>
      <p className="vx-body-lg text-[var(--color-vx-text-secondary)] mb-12">
        VOXY takes security seriously. Here&apos;s what we do and how to
        report a vulnerability.
      </p>

      <div className="grid gap-6 mb-16">
        {practices.map((practice) => (
          <div
            key={practice.title}
            className="rounded-xl border border-[var(--color-vx-border)] bg-[var(--color-vx-raised)] p-6"
          >
            <div className="flex items-start gap-4">
              <div className="mt-0.5 p-2 rounded-lg bg-[color-mix(in_srgb,var(--color-vx-accent)_10%,transparent)]">
                <practice.icon
                  size={16}
                  className="text-[var(--color-vx-accent)]"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[var(--color-vx-text-primary)] mb-2">
                  {practice.title}
                </h2>
                <p className="text-sm text-[var(--color-vx-text-secondary)] leading-relaxed">
                  {practice.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section aria-labelledby="disclosure">
        <h2
          id="disclosure"
          className="vx-h2 text-[var(--color-vx-text-primary)] mb-4"
        >
          Responsible disclosure
        </h2>
        <p className="vx-body text-[var(--color-vx-text-secondary)] mb-4">
          If you discover a security vulnerability, please report it responsibly.
          We ask that you:
        </p>
        <ul className="vx-body text-[var(--color-vx-text-secondary)] space-y-2 list-disc list-inside mb-6">
          <li>Do not exploit the vulnerability beyond confirming it exists</li>
          <li>Do not access or modify data that isn&apos;t yours</li>
          <li>Report privately before any public disclosure</li>
          <li>Allow us reasonable time to address the issue</li>
        </ul>
        <p className="vx-body text-[var(--color-vx-text-secondary)]">
          Report vulnerabilities to{" "}
          <a
            href="mailto:security@voxy.app"
            className="text-[var(--color-vx-accent)] hover:underline"
          >
            security@voxy.app
          </a>
          . We acknowledge all reports within 24 hours.
        </p>
      </section>
    </div>
  );
}
