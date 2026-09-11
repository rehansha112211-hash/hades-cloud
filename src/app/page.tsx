"use client";

import { useEffect, useState } from "react";
import { useNav, initNavFromUrl } from "@/stores/nav-store";
import { PublicSite } from "@/components/public-site/public-site";
import { OrderPage } from "@/components/public-site/order-page";
import { OrderSuccessPage } from "@/components/public-site/order-success-page";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminShell } from "@/components/admin/admin-shell";
import { ScrollProgressBar } from "@/components/enhanced/scroll-progress-bar";

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

  const showProgress = !hydrated || view.name === "public";

  if (!hydrated || view.name === "public") {
    return (
      <>
        {showProgress && <ScrollProgressBar />}
        <PublicSite />
      </>
    );
  }

  if (view.name === "order") {
    return <OrderPage planId={view.planId} />;
  }

  if (view.name === "order-success") {
    return <OrderSuccessPage orderNumber={view.orderNumber} />;
  }

  if (view.name === "login") {
    return <AdminLogin />;
  }

  if (view.name === "admin") {
    return <AdminShell />;
  }

  return (
    <>
      <ScrollProgressBar />
      <PublicSite />
    </>
  );
}
