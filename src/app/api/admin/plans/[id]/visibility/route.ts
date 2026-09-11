import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { flattenPlan } from "@/lib/plan-serializer";

/**
 * PATCH /api/admin/plans/[id]/visibility
 * Toggle visibility of a plan without deleting it.
 *
 * Hidden plans remain in the database, remain visible in the admin panel,
 * and disappear from the public website. Showing a plan makes it reappear.
 */
async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const isVisible =
      typeof body.isVisible === "boolean" ? body.isVisible : undefined;

    const existing = await db.plan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const next = isVisible ?? !existing.isVisible;
    const plan = await db.plan.update({
      where: { id },
      data: { isVisible: next },
      include: { category: true },
    });
    return NextResponse.json({ plan: flattenPlan(plan) });
  } catch (err) {
    console.error("[admin/plans/[id]/visibility] error:", err);
    return NextResponse.json(
      { error: "Failed to toggle visibility" },
      { status: 500 }
    );
  }
}

export { PATCH };
