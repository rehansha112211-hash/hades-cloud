import { PrismaClient } from '@prisma/client'

const dbUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_xNm8DUl3pKWt@ep-wild-mud-b392bodl-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'

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
