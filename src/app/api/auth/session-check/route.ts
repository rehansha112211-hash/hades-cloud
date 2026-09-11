import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/auth/session-check
 * Tiny endpoint the frontend uses to know if the user is authenticated as admin.
 */
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }
  return NextResponse.json({
    authenticated: true,
    user: {
      email: session.user.email,
      name: session.user.name,
    },
  });
}
