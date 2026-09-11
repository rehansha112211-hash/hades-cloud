import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categoryUpdateSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/helpers";

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
    const parsed = categoryUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const data: { name?: string; slug?: string } = {};
    if (parsed.data.name) {
      data.name = parsed.data.name.trim();
      data.slug = slugify(data.name);
      const conflict = await db.category.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (conflict) {
        return NextResponse.json(
          { error: "Another category with this name already exists" },
          { status: 409 }
        );
      }
    }

    const category = await db.category.update({ where: { id }, data });
    return NextResponse.json({ category });
  } catch (err) {
    console.error("[admin/categories/[id]] PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/categories/[id]
 * Safe deletion: if the category still has plans, the API refuses the delete
 * and instructs the admin to reassign or remove plans first.
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
    const existing = await db.category.findUnique({
      where: { id },
      include: { _count: { select: { plans: true } } },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    if (existing._count.plans > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete: ${existing._count.plans} plan(s) use this category. Reassign or delete those plans first.`,
        },
        { status: 409 }
      );
    }
    await db.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/categories/[id]] DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}

export { PATCH, DELETE };
