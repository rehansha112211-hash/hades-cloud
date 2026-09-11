import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orderCreateSchema } from "@/lib/validators";
import { generateOrderNumber, rateLimit } from "@/lib/helpers";

/**
 * POST /api/orders
 * Creates a new order in PENDING_PAYMENT state.
 *
 * No payment is processed here. The order is created so a real payment gateway
 * can later be plugged in (Razorpay/Stripe) to capture payment and update
 * the order status to PAID. We never fake a payment success.
 */
export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = rateLimit(`order:create:${ip}`, 8, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many order attempts. Please slow down." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = orderCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid order payload",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { planId, customer, customerNote } = parsed.data;

    // Validate plan exists and is visible
    const plan = await db.plan.findUnique({
      where: { id: planId },
      include: { category: true },
    });
    if (!plan || !plan.isVisible) {
      return NextResponse.json(
        { error: "Selected plan is not available." },
        { status: 404 }
      );
    }

    // Find or create customer
    let customerRow = await db.customer.findUnique({
      where: { email: customer.email.toLowerCase() },
    });
    if (!customerRow) {
      customerRow = await db.customer.create({
        data: {
          name: customer.name,
          email: customer.email.toLowerCase(),
          phone: customer.phone ?? null,
        },
      });
    } else if (customer.phone && customerRow.phone !== customer.phone) {
      // Update phone if customer already exists but provided new phone
      customerRow = await db.customer.update({
        where: { id: customerRow.id },
        data: { phone: customer.phone },
      });
    }

    // Generate a unique order number
    let orderNumber = generateOrderNumber();
    for (let i = 0; i < 5; i++) {
      const exists = await db.order.findUnique({
        where: { orderNumber },
      });
      if (!exists) break;
      orderNumber = generateOrderNumber();
    }

    const order = await db.order.create({
      data: {
        orderNumber,
        customerId: customerRow.id,
        planId: plan.id,
        amount: plan.price,
        status: "PENDING_PAYMENT",
        customerNote: customerNote ?? null,
      },
      include: {
        plan: { include: { category: true } },
        customer: true,
      },
    });

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
      // The next step (payment) is intentionally NOT executed here.
      // When PAYMENT_PROVIDER is set to "razorpay" or "stripe" and real
      // credentials exist, this response will include a payment gateway
      // redirect URL / order ID. Until then, the customer is told their
      // order is saved and awaiting payment.
      payment: {
        provider: process.env.PAYMENT_PROVIDER ?? "none",
        status: "NOT_INITIATED",
        message:
          process.env.PAYMENT_PROVIDER === "none"
            ? "Payment gateway is not configured yet. Your order has been saved and is awaiting payment — our team will reach out shortly."
            : "Redirect to payment gateway will happen here once credentials are configured.",
      },
    });
  } catch (err) {
    console.error("[orders/create] error:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
