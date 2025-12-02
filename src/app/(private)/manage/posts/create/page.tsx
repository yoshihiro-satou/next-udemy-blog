'use client'
import { useState, useActionState } from "react";
// import createPost from "@/lib/actions/createPost";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import TextareaAutosize from "react-textarea-autosize";
import "highlight.js/styles/github.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { createPost } from "@/lib/actions/createPost";

export default function CreatePage() {
  const [content, setContent] = useState('')
  const [contentLength, setContentLength] = useState(0)
  const [preview, setPreview] = useState(false)
  const [state, formAction] = useActionState(createPost, {
    success: false, errors: {} })

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setContent(value)
    setContentLength(value.length)
  }

  return (
    <div className="container mx-auto mt-10 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">新規記事投稿(Markdown対応)</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input 
            type="text" 
            id="title" 
            name="title" 
            placeholder="タイトルを入力してください"
            required
          />
          {state.errors.title && (
            <p className="text-red-500 text-sm mt-1">{state.errors.title.join(',')}</p>
          )}
        </div>
        <div>
          <Label htmlFor="topImage">トップ画像</Label>
          <Input
            type="file"
            id="topImage"
            accept="images/*"
            name="topImage"
          />
          {state.errors.topImage && (
            <p className="text-red-500 text-sm mt-1">{state.errors.topImage.join(',')}</p>
          )}
        </div>
        <div>
          <Label htmlFor="content">内容(Markdown)</Label>
          <TextareaAutosize
            id="content"
            name="content"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Markdown形式で入力してください"
            minRows={8}
            value={content}
            onChange={handleContentChange}
            required
          />
          {state.errors.content && (
            <p className="text-red-500 text-sm mt-1">{state.errors.content.join(',')}</p>
          )}
        </div>
        <div className="text-right text-sm text-gray-500">
          文字数：{contentLength}
        </div>
        <div>
          <Button
            type="button"
            onClick={() => setPreview(!preview)}
            variant="outline"
          >
            {preview ? "プレビューを閉じる" : "プレビューを表示"}
          </Button>
        </div>
        {preview && (
          <div className="prose prose-sm max-w-none dark:prose-invert overflow-auto [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_table]:table-fixed [&_thead]:bg-gray-100 [&_th]:border [&_th]:border-gray-300 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_td]:border [&_td]:border-gray-300 [&_td]:px-4 [&_td]:py-2 [&_tbody_tr:nth-child(odd)]:bg-gray-50 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_code]:bg-gray-900 [&_code]:text-white [&_code]:px-3 [&_code]:py-1 [&_code]:rounded [&_pre]:bg-gray-900 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, [rehypeHighlight, { detect: true }]]}
              skipHtml={false}
              unwrapDisallowed={true}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          投稿する
        </Button>
      </form>
    </div>
  )
}
