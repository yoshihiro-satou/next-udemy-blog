'use client'
import { useState, useActionState, useEffect } from "react";
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
import { updatePost } from "@/lib/actions/updatePost";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
type EditPostFormProps = {
  post: {
    id: string;
    title: string;
    content: string;
    topImage: string | null;
    published: boolean
  }
}
export default function EditPostForm({post}: EditPostFormProps) {
  const [content, setContent] = useState(post.content)
  const [contentLength, setContentLength] = useState(0)
  const [preview, setPreview] = useState(false)
  const [ title, setTitle ] = useState(post.title)
  const [ published, setPublished ]= useState(post.published)
  const [ imagePreview, setImagePreview ] = useState(post.topImage)

  const [state, formAction] = useActionState(updatePost, {
    success: false, errors: {} })

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setContent(value)
    setContentLength(value.length)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file) {
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }
  useEffect(() => {
    return () => {
      if(imagePreview && imagePreview !== post.topImage) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  },[imagePreview, post.topImage])
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt={post.title}
                width={0}
                height={0}
                sizes="200px"
                className="w-[200px]"
                priority
              />
            </div>
          )}
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

        <RadioGroup value={published.toString()} name="published" onValueChange={(value) => setPublished(value === 'true')}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="published-one" />
            <Label htmlFor="published-one">表示</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="published-two" />
            <Label htmlFor="published-two">非表示</Label>
          </div>
        </RadioGroup>

        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          更新する
        </Button>
        <input type="hidden" name="postId" value={post.id} />
        <input type="hidden" name="oldImageUrl" value={post.topImage || ''} />
      </form>
    </div>
  )
}
