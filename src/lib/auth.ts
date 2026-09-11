import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { rateLimit } from "@/lib/helpers";

const LOGIN_RATE_LIMIT = 8; // attempts
const LOGIN_RATE_WINDOW = 10 * 60 * 1000; // 10 minutes

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 hours
  },
  cookies: {
    sessionToken: {
      name: "hadescloud_session",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;

        // Safely extract IP — req may be undefined in some NextAuth setups
        let ip = "unknown";
        try {
          const headers = req?.headers;
          if (headers) {
            // Headers can be a Headers object or a plain object
            const xff =
              typeof headers.get === "function"
                ? headers.get("x-forwarded-for")
                : (headers as Record<string, string>)["x-forwarded-for"];
            if (xff) ip = xff.split(",")[0].trim();
          }
        } catch {
          // ignore header access errors
        }

        const rl = rateLimit(`login:${ip}`, LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW);
        if (!rl.ok) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        const user = await db.adminUser.findUnique({
          where: { email },
        });
        if (!user) return null;

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        } as {
          id: string;
          email: string;
          name?: string | null;
          role?: string;
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role?: string }).role ?? "ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/?view=login",
    error: "/?view=login&error=1",
  },
  secret: process.env.AUTH_SECRET,
};

export async function getAdminSession() {
  return getServerSession(authOptions);
}

/**
 * Returns the admin session or null. Use in API routes to gate admin-only endpoints.
 */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session?.user) return null;
  return session;
}
