import { SiteLayout } from "@/components/shared/site-layout";
import { FaqSection } from "@/components/public-site/faq-section";

export default function FaqPage() {
  return (
    <SiteLayout activePage="/faq">
      <div className="pt-8">
        <FaqSection />
      </div>
    </SiteLayout>
  );
}
