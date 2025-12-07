import { getOwnPost } from "@/lib/ownPost"
import { notFound } from "next/navigation"
import  Image from 'next/image'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { auth } from '@/auth'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github.css";
type Params = {
  params: Promise<{id: string}>
}

export default async function ShowPage({ params }: Params) {
  const session = await auth()
    const userId = session?.user?.id
    if(!session?.user?.email || !userId) {
      throw new Error('不正なリクエストです')
    }

  const {id} = await params
  const post = await getOwnPost(userId, id)

  if(!post) {
    notFound()
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        {post.topImage && (
          <div className='relative w-full h-64 lg:h-96'>
            <Image
              src={post.topImage}
              alt={post.title}
              fill
              sizes="100vw"
              className='rounded-t-md object-cover'
              priority
              />
          </div>
        )}
        <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            投稿者： { post.author.name }
          </p>
          <time className="text-sm text-gray-500">
            { format(new Date(post.createdAt), 'yyyy年MM月dd日', {locale: ja})}
          </time>
        </div>
          <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert overflow-auto [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_table]:table-fixed [&_thead]:bg-gray-100 [&_th]:border [&_th]:border-gray-300 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_td]:border [&_td]:border-gray-300 [&_td]:px-4 [&_td]:py-2 [&_tbody_tr:nth-child(odd)]:bg-gray-50 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_code]:bg-gray-900 [&_code]:text-white [&_code]:px-3 [&_code]:py-1 [&_code]:rounded [&_pre]:bg-gray-900 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeRaw,
                [rehypeHighlight, { detect: true }]
              ]}
              skipHtml={false}
              unwrapDisallowed={true}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
