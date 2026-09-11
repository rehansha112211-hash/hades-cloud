"use client";

import { PublicNavbar } from "@/components/public-site/navbar";
import { Hero } from "@/components/public-site/hero";
import { WhyHadesCloud } from "@/components/public-site/why-hades-cloud";
import { PlansSection } from "@/components/public-site/plans-section";
import { ControlPanelSection } from "@/components/public-site/control-panel-section";
import { FeaturesSection } from "@/components/public-site/features-section";
import { FaqSection } from "@/components/public-site/faq-section";
import { ContactSection } from "@/components/public-site/contact-section";
import { Footer } from "@/components/public-site/footer";

export function PublicSite() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Hero />
        <WhyHadesCloud />
        <PlansSection />
        <ControlPanelSection />
        <FeaturesSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
