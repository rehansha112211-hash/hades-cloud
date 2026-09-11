"use client";

import { PublicNavbar } from "@/components/public-site/navbar";
import { Hero } from "@/components/public-site/hero";
import { WhyHadesCloud } from "@/components/public-site/why-hades-cloud";
import { MetricsSection } from "@/components/public-site/metrics-section";
import { PlansSection } from "@/components/public-site/plans-section";
import { ControlPanelSection } from "@/components/public-site/control-panel-section";
import { FeaturesSection } from "@/components/public-site/features-section";
import { GallerySection } from "@/components/public-site/gallery-section";
import { TestimonialsSection } from "@/components/public-site/testimonials-section";
import { FaqSection } from "@/components/public-site/faq-section";
import { ContactSection } from "@/components/public-site/contact-section";
import { Footer } from "@/components/public-site/footer";
import { AnimatedStarfield } from "@/components/enhanced/animated-starfield";

export function PublicSite() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Fixed animated starfield background — behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatedStarfield density={1.2} className="w-full h-full" />
        {/* Subtle nebula glow overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 20% 30%, oklch(0.45 0.15 260 / 0.08), transparent 70%), radial-gradient(ellipse 50% 40% at 80% 70%, oklch(0.55 0.18 280 / 0.06), transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <PublicNavbar />
        <main className="flex-1">
          <Hero />
          <WhyHadesCloud />
          <MetricsSection />
          <PlansSection />
          <ControlPanelSection />
          <FeaturesSection />
          <GallerySection />
          <TestimonialsSection />
          <FaqSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
