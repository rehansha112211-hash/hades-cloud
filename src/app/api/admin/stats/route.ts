import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/stats
 * Dashboard overview statistics.
 */
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [
    totalPlans,
    visiblePlans,
    hiddenPlans,
    totalOrders,
    totalCustomers,
    pendingPaymentOrders,
    paidOrders,
    revenue,
  ] = await Promise.all([
    db.plan.count(),
    db.plan.count({ where: { isVisible: true } }),
    db.plan.count({ where: { isVisible: false } }),
    db.order.count(),
    db.customer.count(),
    db.order.count({ where: { status: "PENDING_PAYMENT" } }),
    db.order.count({ where: { status: "PAID" } }),
    db.order.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalPlans,
      visiblePlans,
      hiddenPlans,
      totalOrders,
      totalCustomers,
      pendingPaymentOrders,
      paidOrders,
      revenue: revenue._sum.amount ?? 0,
    },
  });
}
