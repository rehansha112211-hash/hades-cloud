import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/public/faqs
 * Returns visible FAQ entries for the public website.
 */
export async function GET() {
  try {
    const faqs = await db.faq.findMany({
      where: { isVisible: true },
      orderBy: [{ sortOrder: "asc" }],
      select: {
        id: true,
        question: true,
        answer: true,
      },
    });
    return NextResponse.json({ faqs });
  } catch (err) {
    console.error("[public/faqs] error:", err);
    return NextResponse.json(
      { error: "Failed to load FAQ" },
      { status: 500 }
    );
  }
}
