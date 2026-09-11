import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/helpers";

/**
 * POST /api/contact
 * Public contact form. Saves nothing — for now just rate-limits and
 * returns success. In production wire this to email or ticketing service.
 */
export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = rateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }
    const body = await req.json();
    const name = String(body.name ?? "").trim().slice(0, 120);
    const email = String(body.email ?? "").trim().slice(0, 254);
    const message = String(body.message ?? "").trim().slice(0, 5000);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // TODO: wire to email/ticketing service in production.
    console.log("[contact form submission]", { name, email, message });

    return NextResponse.json({
      success: true,
      message:
        "Thanks for reaching out. Our team will respond within one business day.",
    });
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json(
      { error: "Failed to submit message" },
      { status: 500 }
    );
  }
}
