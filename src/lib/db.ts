import { PrismaClient } from '@prisma/client'

/**
 * Prisma client singleton.
 * On Vercel serverless, we MUST reuse the client across warm invocations
 * to avoid exhausting DB connections. We also ensure the correct
 * DATABASE_URL is used (defaults to /tmp/hades-cloud.db on Vercel).
 */
const dbUrl = process.env.DATABASE_URL || 'file:/tmp/hades-cloud.db'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: dbUrl },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
