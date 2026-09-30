import type { Metadata } from "next";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProductSection } from "@/components/sections/ProductSection";
import { ArchitectureSection } from "@/components/sections/ArchitectureSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { ChangelogSection } from "@/components/sections/ChangelogSection";
import { WaitlistSection } from "@/components/sections/WaitlistSection";

export const metadata: Metadata = {
  title: "VOXY — Your Operating Companion",
};

// This page uses client components — no DB queries needed at this level
export default function HomePage() {
  return (
    <>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        {/* Skip to content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-vx-accent)] focus:text-white focus:rounded-lg focus:text-sm"
        >
          Skip to content
        </a>

        <HeroSection />
        <ProductSection />
        <ArchitectureSection />
        <PricingSection />
        <ChangelogSection />
        <WaitlistSection />
      </main>
      <Footer />
    </>
  );
}
