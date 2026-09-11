import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/orders
 * Returns all orders with customer + plan summary.
 */
async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = Math.min(Number(searchParams.get("limit") || "100"), 500);

  const orders = await db.order.findMany({
    where: status ? { status } : undefined,
    include: {
      customer: true,
      plan: { include: { category: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      amount: o.amount,
      status: o.status,
      createdAt: o.createdAt,
      customer: {
        name: o.customer.name,
        email: o.customer.email,
        phone: o.customer.phone,
      },
      plan: o.plan
        ? {
            name: o.plan.name,
            duration: o.plan.duration,
            category: o.plan.category.name,
          }
        : null,
    })),
  });
}

export { GET };
