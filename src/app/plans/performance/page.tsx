import { PlansListPage } from "@/components/shared/plans-list-page";

export default function PerformancePlansPage() {
  return (
    <PlansListPage
      planType="performance"
      title="Performance Plans"
      subtitle="High-performance servers with more RAM, faster CPUs, and larger NVMe storage. Built for growing communities and demanding modpacks."
      activePage="/plans/performance"
    />
  );
}
