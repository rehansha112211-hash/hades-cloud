import { PlansListPage } from "@/components/shared/plans-list-page";

export default function VpsPlansPage() {
  return (
    <PlansListPage
      planType="vps"
      title="VPS Plans"
      subtitle="Virtual Private Servers with full root access, dedicated resources, and complete control. Perfect for hosting multiple services, game servers, and applications."
      activePage="/plans/vps"
    />
  );
}
