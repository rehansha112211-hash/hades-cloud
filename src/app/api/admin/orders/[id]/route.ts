import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

/**
 * PATCH /api/admin/orders/[id]
 * Update order status. Used by admin to mark orders as PAID after manual
 * confirmation (until a real payment gateway webhook is wired up).
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
    const allowed = [
      "PENDING_PAYMENT",
      "AWAITING_PAYMENT",
      "PAID",
      "FAILED",
      "CANCELLED",
      "REFUNDED",
    ];
    if (!allowed.includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }
    const existing = await db.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const order = await db.order.update({
      where: { id },
      data: { status: body.status },
    });
    return NextResponse.json({ order });
  } catch (err) {
    console.error("[admin/orders/[id]] PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export { PATCH };
