import Link from "next/link";
import { cn } from "@/lib/cn";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#product" },
    { label: "Architecture", href: "/#architecture" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Changelog", href: "/#changelog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Security", href: "/security" },
  ],
  Developers: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api-reference" },
    { label: "System Status", href: "/status" },
  ],
};

function VoxyLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="VOXY">
      <div className="relative w-6 h-6" aria-hidden="true">
        <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="13" stroke="url(#footerLogoGrad)" strokeWidth="1.5" />
          <path
            d="M8 10 L14 18 L20 10"
            stroke="url(#footerLogoGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="14" cy="14" r="2" fill="url(#footerLogoGrad)" />
          <defs>
            <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9580ff" />
              <stop offset="100%" stopColor="#6040cc" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="text-[14px] font-semibold tracking-[-0.02em] text-[var(--color-vx-text-primary)]">
        VOXY
      </span>
    </Link>
  );
}

export function Footer() {
  return (
    <footer
      className="border-t border-[var(--color-vx-border)] pt-16 pb-10"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_auto_auto] gap-10 md:gap-16 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <VoxyLogo />
            <p className="mt-4 text-sm text-[var(--color-vx-text-muted)] max-w-[220px]">
              Your operating companion. Built for macOS. Local-first.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full bg-[var(--color-vx-success)] animate-pulse"
                aria-hidden="true"
              />
              <span className="text-xs text-[var(--color-vx-text-muted)]">
                Systems operational
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-vx-text-muted)] mb-4">
                {group}
              </h3>
              <ul className="flex flex-col gap-2.5" role="list">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-sm text-[var(--color-vx-text-secondary)]",
                        "hover:text-[var(--color-vx-text-primary)]",
                        "transition-colors duration-150"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-[var(--color-vx-border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-vx-text-muted)]">
            &copy; {new Date().getFullYear()} VOXY. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-vx-text-muted)] font-mono">
            v0.9.2-beta · macOS 13+
          </p>
        </div>
      </div>
    </footer>
  );
}
