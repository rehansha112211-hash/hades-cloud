import { PlansListPage } from "@/components/shared/plans-list-page";

export default function BudgetPlansPage() {
  return (
    <PlansListPage
      planType="budget"
      title="Budget Plans"
      subtitle="Affordable Minecraft hosting for small communities and starters. Get your server online without breaking the bank."
      activePage="/plans/budget"
    />
  );
}
