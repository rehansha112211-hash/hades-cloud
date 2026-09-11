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
import { ScrollBackgroundChanger } from "@/components/enhanced/scroll-background-changer";

export function PublicSite() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Fixed scroll-driven Minecraft background — crossfades as you scroll */}
      <ScrollBackgroundChanger />

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
