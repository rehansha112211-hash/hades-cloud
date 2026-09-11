import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/public/plans
 * Returns all VISIBLE plans for the public website.
 * Hidden plans are excluded. Categories are joined for the UI.
 */
export async function GET() {
  try {
    const plans = await db.plan.findMany({
      where: { isVisible: true },
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { price: "asc" }],
    });

    const payload = plans.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category.name,
      price: p.price,
      duration: p.duration,
      ram: p.ram,
      storage: p.storage,
      storageType: p.storageType,
      cpu: p.cpu,
      processor: p.processor,
    }));

    return NextResponse.json({ plans: payload });
  } catch (err) {
    console.error("[public/plans] error:", err);
    return NextResponse.json(
      { error: "Failed to load plans" },
      { status: 500 }
    );
  }
}
