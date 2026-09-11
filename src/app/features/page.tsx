import { SiteLayout } from "@/components/shared/site-layout";
import { FeaturesSection } from "@/components/public-site/features-section";

export default function FeaturesPage() {
  return (
    <SiteLayout activePage="/features">
      <div className="pt-8">
        <FeaturesSection />
      </div>
    </SiteLayout>
  );
}
