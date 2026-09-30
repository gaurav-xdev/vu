"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

const navItems: NavItem[] = [
  { label: "Product", href: "/#product" },
  { label: "Architecture", href: "/#architecture" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Changelog", href: "/#changelog" },
];

function VoxyLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 focus-visible:outline-[var(--color-vx-accent)]"
      aria-label="VOXY — Home"
    >
      {/* Logo mark */}
      <div
        className="relative w-7 h-7"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle cx="14" cy="14" r="13" stroke="url(#logoGrad)" strokeWidth="1.5" />
          <path
            d="M8 10 L14 18 L20 10"
            stroke="url(#logoGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="14" cy="14" r="2" fill="url(#logoGrad)" />
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9580ff" />
              <stop offset="100%" stopColor="#6040cc" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span
        className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-vx-text-primary)]"
      >
        VOXY
      </span>
    </Link>
  );
}

function DropdownMenu({
  items,
  open,
}: {
  items: NonNullable<NavItem["children"]>;
  open: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 mt-2 w-64",
        "bg-[var(--color-vx-raised)] border border-[var(--color-vx-border)] rounded-xl",
        "shadow-[0_16px_48px_rgba(0,0,0,0.4)]",
        "transition-all duration-200",
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      )}
      role="menu"
    >
      <div className="p-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            role="menuitem"
            className={cn(
              "block px-3 py-2.5 rounded-lg",
              "text-sm text-[var(--color-vx-text-secondary)]",
              "hover:bg-[var(--color-vx-surface)] hover:text-[var(--color-vx-text-primary)]",
              "transition-colors duration-150"
            )}
          >
            <span className="font-medium">{item.label}</span>
            {item.description && (
              <span className="block text-xs text-[var(--color-vx-text-muted)] mt-0.5">
                {item.description}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40",
          "transition-all duration-300",
          scrolled
            ? "bg-[color-mix(in_srgb,var(--color-vx-void)_90%,transparent)] backdrop-blur-xl border-b border-[var(--color-vx-border)]"
            : "bg-transparent"
        )}
      >
        <nav
          ref={navRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          <VoxyLogo />

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {navItems.map((item) => (
              <li key={item.href} className="relative">
                {item.children ? (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.label ? null : item.label
                        )
                      }
                      aria-expanded={openDropdown === item.label}
                      className={cn(
                        "flex items-center gap-1 px-3.5 py-2 rounded-lg",
                        "text-sm font-medium",
                        "text-[var(--color-vx-text-secondary)]",
                        "hover:bg-[var(--color-vx-surface)] hover:text-[var(--color-vx-text-primary)]",
                        "transition-colors duration-150"
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform duration-200",
                          openDropdown === item.label && "rotate-180"
                        )}
                      />
                    </button>
                    <DropdownMenu
                      items={item.children}
                      open={openDropdown === item.label}
                    />
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-3.5 py-2 rounded-lg",
                      "text-sm font-medium",
                      "text-[var(--color-vx-text-secondary)]",
                      "hover:bg-[var(--color-vx-surface)] hover:text-[var(--color-vx-text-primary)]",
                      "transition-colors duration-150"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-[var(--color-vx-text-secondary)] hover:text-[var(--color-vx-text-primary)] transition-colors px-3 py-2"
            >
              Sign in
            </Link>
            <Button size="sm">
              <Link href="/auth/register" className="contents">Get early access</Link>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg",
              "text-[var(--color-vx-text-secondary)]",
              "hover:bg-[var(--color-vx-surface)] hover:text-[var(--color-vx-text-primary)]",
              "transition-colors"
            )}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Mobile Nav */}
      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-0 z-30 md:hidden",
          "bg-[var(--color-vx-void)]",
          "transition-all duration-300",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-8">
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col gap-1" role="list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block py-3.5 text-lg font-medium",
                      "text-[var(--color-vx-text-secondary)]",
                      "border-b border-[var(--color-vx-border)]",
                      "hover:text-[var(--color-vx-text-primary)] transition-colors"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="text-center py-3 text-sm font-medium text-[var(--color-vx-text-secondary)] hover:text-[var(--color-vx-text-primary)] transition-colors"
            >
              Sign in
            </Link>
            <Button fullWidth>
              <Link href="/auth/register">Get early access</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
