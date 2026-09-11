import { SiteLayout } from "@/components/shared/site-layout";
import { ControlPanelSection } from "@/components/public-site/control-panel-section";

export default function PanelPage() {
  return (
    <SiteLayout activePage="/panel">
      <div className="pt-8">
        <ControlPanelSection />
      </div>
    </SiteLayout>
  );
}
