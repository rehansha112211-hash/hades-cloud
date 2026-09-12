import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { flattenPlan } from "@/lib/plan-serializer";

/**
 * GET /api/public/plans
 * Returns all VISIBLE plans for the public website.
 * Optional ?type=budget|performance|bot|vps filter.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const planType = url.searchParams.get("type");

    const where: { isVisible: boolean; planType?: string } = { isVisible: true };
    if (planType && ["budget", "performance", "bot", "vps"].includes(planType)) {
      where.planType = planType;
    }

    const plans = await db.plan.findMany({
      where,
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { price: "asc" }],
    });

    return NextResponse.json({ plans: plans.map(flattenPlan) });
  } catch (err) {
    console.error("[public/plans] error:", err);
    return NextResponse.json({ error: "Failed to load plans" }, { status: 500 });
  }
}
