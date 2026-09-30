import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "VOXY — Your Operating Companion",
    template: "%s — VOXY",
  },
  description:
    "VOXY sits quietly at the edge of your macOS environment. Voice-activated. Context-aware. Local-first. Built for professionals who live in the command layer.",
  keywords: ["voice assistant", "macOS automation", "AI companion", "productivity", "developer tools"],
  authors: [{ name: "VOXY" }],
  creator: "VOXY",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://voxy.app",
    siteName: "VOXY",
    title: "VOXY — Your Operating Companion",
    description:
      "Voice-activated. Context-aware. Local-first. Built for macOS professionals.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VOXY — Your Operating Companion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VOXY — Your Operating Companion",
    description:
      "Voice-activated. Context-aware. Local-first. Built for macOS professionals.",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--color-vx-void)] text-[var(--color-vx-text-primary)] antialiased min-h-screen">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
