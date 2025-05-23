import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getPostBySlug } from "@/lib/strapi"
import CommentSection from "@/components/comment-section"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const postData = await getPostBySlug(params.slug)

  if (!postData) {
    notFound()
  }

  const post = postData.attributes
  const postId = postData.id

  return (
    <div className="w-full bg-background">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <article className="max-w-4xl mx-auto">
          <Button asChild variant="ghost" className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to blog
            </Link>
          </Button>

          <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
            <Image
              src={post.cover?.data?.attributes?.url || "/placeholder.svg?height=720&width=1280&query=blog"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{post.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={post.author?.data?.attributes?.avatar?.data?.attributes?.url || "/placeholder.svg?height=32&width=32&query=avatar"}
                    alt={post.author?.data?.attributes?.name || "Author"}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium">{post.author?.data?.attributes?.name || "Author"}</span>
              </div>
              <time dateTime={post.publishedAt} className="text-sm text-muted-foreground">
                {formatDate(post.publishedAt)}
              </time>
              {post.category?.data?.attributes?.slug && (
                <Link
                  href={`/categories/${post.category.data.attributes.slug}`}
                  className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {post.category.data.attributes.name}
                </Link>
              )}
            </div>
          </div>

          <div
            className="prose prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12">
            <CommentSection postId={postId} comments={post.comments?.data || []} />
          </div>
        </article>
      </div>
    </div>
  )
}
