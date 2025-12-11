import 'dotenv/config'; 
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg' // pgのPoolをインポート

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing. Check .env file.');
}

// 1. pgのPoolを作成
const pool = new Pool({ connectionString })

// 2. PoolをPrismaPgに渡す
const adapter = new PrismaPg(pool)

// 3. アダプターをPrismaClientに渡す
const prisma = new PrismaClient({
  adapter, // <-- これがエラー解決の鍵！
  log: [],
})

async function main() {
  console.log('Starting seeding...')

  // クリーンアップ
  await prisma.post.deleteMany()
  console.log('Deleted all posts')
  await prisma.user.deleteMany()
  console.log('Deleted all users')

  const hashedPassword = await bcrypt.hash('password123', 12)

  const dummyImages = [
    'https://picsum.photos/seed/post1/600/400',
    'https://picsum.photos/seed/post2/600/400',
  ]

  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      posts: {
        create: [
          {
            title: '初めてのブログ投稿',
            content: 'これは最初のブログ投稿です。Next.js + Prisma で作りました！',
            topImage: dummyImages[0],
            published: true,
          },
          {
            title: '2番目のブログ投稿',
            content: 'Prismaのシーディングも簡単ですね！',
            topImage: dummyImages[1],
            published: true,
          },
        ],
      },
    },
    include: {
      posts: true,
    },
  })

  console.log('Seeding completed!')
  console.log({ user })
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
