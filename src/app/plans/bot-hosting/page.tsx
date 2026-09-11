import { PlansListPage } from "@/components/shared/plans-list-page";

export default function BotHostingPage() {
  return (
    <PlansListPage
      planType="bot"
      title="Bot Hosting"
      subtitle="Dedicated hosting for Discord bots, Minecraft bots, and automation. Keep your bots running 24/7 with reliable uptime."
      activePage="/plans/bot-hosting"
    />
  );
}
