import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const validSlugs = ["terms", "privacy", "refund"];
  if (!validSlugs.includes(slug)) {
    return NextResponse.json({ error: "Invalid legal page" }, { status: 404 });
  }
  try {
    const setting = await db.setting.findUnique({ where: { key: "legal_" + slug } });
    const content = setting?.value || getDefaultLegal(slug);
    return NextResponse.json({ slug, content });
  } catch {
    return NextResponse.json({ slug, content: getDefaultLegal(slug) });
  }
}

function getDefaultLegal(type: string): string {
  const defaults: Record<string, string> = {
    terms: "# Terms & Conditions\n\n## 1. Acceptance of Terms\nBy using Hades Cloud services, you agree to these Terms & Conditions.\n\n## 2. Services\nHades Cloud provides Minecraft server hosting services.\n\n## 3. User Responsibilities\nYou are responsible for all activity on your server.\n\n## 4. Payment\nAll payments are processed through our Discord ticket system.\n\n## 5. Limitation of Liability\nHades Cloud is not liable for any data loss, downtime, or damages beyond the cost of your hosting plan.\n\n## 6. Contact\nFor questions, please join our Discord server.",
    privacy: "# Privacy Policy\n\n## 1. Information We Collect\nWe collect your name, email, and payment information when you place an order.\n\n## 2. How We Use Your Information\nTo process orders, provide hosting, and communicate with you.\n\n## 3. Data Storage\nYour data is stored securely in our database.\n\n## 4. Data Sharing\nWe do not sell or share your personal information with third parties.\n\n## 5. Your Rights\nYou may request deletion of your data at any time via Discord.",
    refund: "# Refund Policy\n\n## 1. Refund Eligibility\nNew subscriptions: Full refund within 24 hours if server has not been used.\n\n## 2. How to Request\nOpen a ticket in our Discord server within 24 hours of purchase.\n\n## 3. Processing\nApproved refunds processed within 5-7 business days.\n\n## 4. Non-Refundable\nRenewals, setup fees, and services cancelled due to Terms violations.",
  };
  return defaults[type] || "Content not available.";
}
