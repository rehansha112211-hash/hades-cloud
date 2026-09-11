import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/settings
 * Returns non-secret settings (everything from the Settings table).
 * Secret credentials like AUTH_SECRET, PAYMENT_SECRET are NEVER exposed here —
 * they live only in environment variables.
 */
async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db.setting.findMany();
  const settings: Record<string, string> = {};
  for (const r of rows) settings[r.key] = r.value;
  return NextResponse.json({
    settings: {
      supportEmail: settings.supportEmail ?? "",
      discordUrl: settings.discordUrl ?? "",
      contactPhone: settings.contactPhone ?? "",
    },
    // Surface the configured payment provider (non-secret) so admin knows
    // which gateway is currently active without exposing the secret key.
    payment: {
      provider: process.env.PAYMENT_PROVIDER ?? "none",
      configured:
        process.env.PAYMENT_PROVIDER === "none"
          ? false
          : Boolean(
              process.env.PAYMENT_SECRET &&
                process.env.PAYMENT_SECRET !==
                  "placeholder-payment-secret-change-me"
            ),
    },
  });
}

/**
 * PUT /api/admin/settings
 * Update non-secret settings.
 */
async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const allowed = ["supportEmail", "discordUrl", "contactPhone"];
    for (const key of allowed) {
      if (typeof body[key] === "string") {
        await db.setting.upsert({
          where: { key },
          update: { value: body[key] },
          create: { key, value: body[key] },
        });
      }
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/settings] PUT error:", err);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}

export { GET, PUT };
