import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/auth/logout
 * Explicitly destroys the session (used by admin logout button).
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({
    success: true,
    redirect: "/api/auth/signout?callbackUrl=%2F",
  });
}
