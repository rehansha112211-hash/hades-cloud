"use client";

import { useEffect, useState } from "react";
import { useNav, initNavFromUrl } from "@/stores/nav-store";
import { SiteLayout } from "@/components/shared/site-layout";
import { Hero } from "@/components/public-site/hero";
import { FeaturesSection } from "@/components/public-site/features-section";
import { ControlPanelSection } from "@/components/public-site/control-panel-section";
import { FaqSection } from "@/components/public-site/faq-section";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminShell } from "@/components/admin/admin-shell";

export default function Home() {
  const { view } = useNav();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    initNavFromUrl();
    setHydrated(true);
    const onPop = () => initNavFromUrl();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  if (!hydrated || view.name === "public") {
    return (
      <SiteLayout activePage="/">
        <Hero />
        <FeaturesSection />
        <ControlPanelSection />
        <FaqSection />
      </SiteLayout>
    );
  }

  if (view.name === "login") return <AdminLogin />;
  if (view.name === "admin") return <AdminShell />;
  return (
    <SiteLayout activePage="/">
      <Hero />
      <FeaturesSection />
      <ControlPanelSection />
      <FaqSection />
    </SiteLayout>
  );
}
