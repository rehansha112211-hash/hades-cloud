import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categoryCreateSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/helpers";

/**
 * GET /api/admin/categories
 */
async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { plans: true } } },
  });
  return NextResponse.json({
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      planCount: c._count.plans,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
  });
}

/**
 * POST /api/admin/categories
 */
async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = categoryCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid category payload",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const name = parsed.data.name.trim();
    const slug = slugify(name);
    if (!slug) {
      return NextResponse.json(
        { error: "Category name must contain letters or numbers" },
        { status: 400 }
      );
    }
    const existing = await db.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 }
      );
    }
    const category = await db.category.create({ data: { name, slug } });
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    console.error("[admin/categories] POST error:", err);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export { GET, POST };
