/**
 * Slugify a string for use as a category slug.
 * "Diamond Block!" -> "diamond-block"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generate a human-readable order number like HC-2026-AB12CD
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `HC-${year}-${rand}`;
}

/**
 * Convert a price to a formatted INR string. ₹149.00 -> ₹149
 */
export function formatPrice(price: number): string {
  if (Number.isInteger(price)) {
    return `₹${price}`;
  }
  return `₹${price.toFixed(2)}`;
}

/**
 * Basic rate limiter — fixed window, in-memory.
 * NOT suitable for multi-instance production; use Redis in real deployments.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (entry.count >= limit) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count += 1;
  return {
    ok: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  };
}
