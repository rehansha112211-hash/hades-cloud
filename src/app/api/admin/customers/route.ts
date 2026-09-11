import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/customers
 * Returns all customers with order stats.
 */
async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const customers = await db.customer.findMany({
    include: {
      _count: { select: { orders: true } },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true, orderNumber: true, status: true, amount: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({
    customers: customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      orderCount: c._count.orders,
      lastOrder: c.orders[0] ?? null,
      createdAt: c.createdAt,
    })),
  });
}

export { GET };
