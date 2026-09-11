import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/orders/[orderNumber]
 * Public lookup of an order by its order number (used for confirmation pages).
 * Does not expose any payment secrets or admin info.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const order = await db.order.findUnique({
    where: { orderNumber: orderNumber.toUpperCase() },
    include: {
      plan: { include: { category: true } },
      customer: true,
    },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      amount: order.amount,
      status: order.status,
      createdAt: order.createdAt,
      customer: {
        name: order.customer.name,
        email: order.customer.email,
      },
      plan: {
        name: order.plan.name,
        duration: order.plan.duration,
        ram: order.plan.ram,
        storage: order.plan.storage,
        storageType: order.plan.storageType,
        cpu: order.plan.cpu,
        processor: order.plan.processor,
      },
    },
  });
}
