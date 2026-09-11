import bcrypt from "bcryptjs";

/**
 * Hash a plaintext password using bcrypt with 12 rounds.
 * Never store plaintext passwords.
 */
export async function hashPassword(plaintext: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plaintext, salt);
}

/**
 * Verify a plaintext password against a stored bcrypt hash.
 * Returns true on match, false otherwise. Constant-time comparison.
 */
export async function verifyPassword(
  plaintext: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}
