// src/lib/prisma.ts
import { Pool } from 'pg'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// PrismaClientのインスタンスを保持するためのグローバルな変数を定義
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
  // eslint-disable-next-line no-var
  var pool: Pool | undefined
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined. Please check your .env file.')
}

// 開発環境ではグローバル変数からpoolを取得、なければ新規作成
const pool = globalThis.pool || new Pool({ connectionString })
const adapter = new PrismaPg(pool)

// 開発環境ではグローバル変数からprismaを取得、なければ新規作成
const prisma = globalThis.prisma || new PrismaClient({ adapter })

// 開発環境でのみ、作成したインスタンスをグローバル変数に保存
if (process.env.NODE_ENV !== 'production') {
  globalThis.pool = pool
  globalThis.prisma = prisma
}

export { prisma }