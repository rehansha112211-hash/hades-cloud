import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const LEGAL_KEYS = ["terms", "privacy", "refund"];

/**
 * GET /api/admin/legal
 * Returns all legal page contents.
 */
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const settings = await db.setting.findMany({
      where: { key: { in: LEGAL_KEYS.map((k) => "legal_" + k) } },
    });
    const result: Record<string, string> = {};
    for (const key of LEGAL_KEYS) {
      const row = settings.find((s) => s.key === "legal_" + key);
      result[key] = row?.value || getDefaultLegal(key);
    }
    return NextResponse.json({ legal: result });
  } catch (err) {
    console.error("[admin/legal] GET error:", err);
    return NextResponse.json({ error: "Failed to load legal content" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/legal
 * Update legal page content.
 * Body: { terms: "...", privacy: "...", refund: "..." }
 */
export async function PUT(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    for (const key of LEGAL_KEYS) {
      if (typeof body[key] === "string") {
        await db.setting.upsert({
          where: { key: "legal_" + key },
          update: { value: body[key] },
          create: { key: "legal_" + key, value: body[key] },
        });
      }
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/legal] PUT error:", err);
    return NextResponse.json({ error: "Failed to save legal content" }, { status: 500 });
  }
}

/**
 * GET /api/legal/[slug]
 * Public endpoint — returns legal content for a specific page.
 */
export async function GET_PUBLIC(slug: string) {
  try {
    const setting = await db.setting.findUnique({
      where: { key: "legal_" + slug },
    });
    return setting?.value || getDefaultLegal(slug);
  } catch {
    return getDefaultLegal(slug);
  }
}

function getDefaultLegal(type: string): string {
  const defaults: Record<string, string> = {
    terms: `# Terms & Conditions

## 1. Acceptance of Terms
By using Hades Cloud services, you agree to these Terms & Conditions. If you do not agree, please do not use our services.

## 2. Services
Hades Cloud provides Minecraft server hosting services. We reserve the right to modify, suspend, or discontinue any service at any time.

## 3. User Responsibilities
You are responsible for all activity on your server. You must not use our services for illegal activities, spam, or abuse.

## 4. Payment
All payments are processed through our Discord ticket system. Servers are activated after payment confirmation.

## 5. Refunds
Please see our Refund Policy for details on refunds and cancellations.

## 6. Limitation of Liability
Hades Cloud is not liable for any data loss, downtime, or damages beyond the cost of your hosting plan.

## 7. Changes to Terms
We may update these Terms at any time. Continued use of our services constitutes acceptance of the updated Terms.

## 8. Contact
For questions about these Terms, please join our Discord server.`,
    privacy: `# Privacy Policy

## 1. Information We Collect
We collect your name, email, and payment information when you place an order. We use this to provide and manage your hosting services.

## 2. How We Use Your Information
- To process your orders and provide hosting services
- To communicate with you about your account
- To improve our services

## 3. Data Storage
Your data is stored securely in our database. Payment details are not stored on our servers.

## 4. Data Sharing
We do not sell, rent, or share your personal information with third parties, except as required by law.

## 5. Data Retention
We retain your information for as long as your account is active. You may request deletion of your data at any time.

## 6. Cookies
We use essential cookies for authentication and session management.

## 7. Your Rights
You have the right to access, correct, or delete your personal information. Contact us via Discord to exercise these rights.

## 8. Changes to This Policy
We may update this Privacy Policy at any time. We will notify you of significant changes.

## 9. Contact
For privacy questions, please join our Discord server.`,
    refund: `# Refund Policy

## 1. Refund Eligibility
- New subscriptions: Full refund within 24 hours of purchase if the server has not been used
- Renewals: No refund for renewal payments
- Cancelled services: No refund for cancelled or suspended services due to violation of Terms

## 2. How to Request a Refund
To request a refund, please open a ticket in our Discord server within 24 hours of your purchase. Include your order number and reason for the refund.

## 3. Refund Processing
- Approved refunds are processed within 5-7 business days
- Refunds are issued to the original payment method
- We reserve the right to deny refund requests that do not meet our eligibility criteria

## 4. Service Interruption
If your server experiences downtime due to our infrastructure, we may offer service credits proportional to the downtime duration.

## 5. Non-Refundable Items
- Domain registration fees
- Setup fees (if any)
- Services cancelled due to Terms violations

## 6. Changes to This Policy
We may update this Refund Policy at any time. Continued use of our services constitutes acceptance of the updated policy.

## 7. Contact
For refund questions, please join our Discord server.`,
  };
  return defaults[type] || "Content not available. Please configure in admin panel.";
}
