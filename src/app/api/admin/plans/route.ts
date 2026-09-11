import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { planCreateSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/auth";
import { flattenPlan } from "@/lib/plan-serializer";

/**
 * GET /api/admin/plans
 * Returns ALL plans (visible + hidden) for the admin panel.
 */
async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const plans = await db.plan.findMany({
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { price: "asc" }],
    });
    return NextResponse.json({ plans: plans.map(flattenPlan) });
  } catch (err) {
    console.error("[admin/plans] GET error:", err);
    return NextResponse.json({ error: "Failed to load plans" }, { status: 500 });
  }
}

/**
 * POST /api/admin/plans
 * Create a new plan.
 */
async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = planCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid plan payload",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const category = await db.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { error: "Selected category does not exist" },
        { status: 400 }
      );
    }

    const plan = await db.plan.create({
      data: {
        name: data.name.trim(),
        categoryId: data.categoryId,
        price: data.price,
        duration: data.duration,
        ram: data.ram,
        storage: data.storage,
        storageType: data.storageType,
        cpu: data.cpu,
        processor: data.processor,
        isVisible: data.isVisible ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
      include: { category: true },
    });
    return NextResponse.json(
      { plan: flattenPlan(plan) },
      { status: 201 }
    );
  } catch (err) {
    console.error("[admin/plans] POST error:", err);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}

export { GET, POST };
