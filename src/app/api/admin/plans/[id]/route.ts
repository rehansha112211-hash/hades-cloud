import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { planUpdateSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/auth";
import { flattenPlan } from "@/lib/plan-serializer";

/**
 * GET /api/admin/plans/[id]
 */
async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const plan = await db.plan.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }
  return NextResponse.json({ plan });
}

/**
 * PATCH /api/admin/plans/[id]
 * Update a plan. All fields optional.
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
    const body = await req.json();
    const parsed = planUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const existing = await db.plan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (parsed.data.categoryId) {
      const cat = await db.category.findUnique({
        where: { id: parsed.data.categoryId },
      });
      if (!cat) {
        return NextResponse.json(
          { error: "Selected category does not exist" },
          { status: 400 }
        );
      }
    }

    const plan = await db.plan.update({
      where: { id },
      data: parsed.data,
      include: { category: true },
    });
    return NextResponse.json({ plan: flattenPlan(plan) });
  } catch (err) {
    console.error("[admin/plans/[id]] PATCH error:", err);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/plans/[id]
 * Permanently deletes the plan. Orders referencing the plan are preserved
 * (onDelete: Restrict prevents deletion when orders exist — admin must
 * handle that explicitly through a future deprecation workflow).
 */
async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const existing = await db.plan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const orderCount = await db.order.count({ where: { planId: id } });
    if (orderCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete: ${orderCount} order(s) reference this plan. Hide the plan instead, or delete the orders first.`,
        },
        { status: 409 }
      );
    }

    await db.plan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/plans/[id]] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}

export { GET, PATCH, DELETE };
