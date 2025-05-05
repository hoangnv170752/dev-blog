import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

interface Post {
  id: number
  attributes: {
    title: string
    slug: string
    description: string
    publishedAt: string
    cover: {
      data: {
        attributes: {
          url: string
        }
      }
    }
    author: {
      data: {
        attributes: {
          name: string
          avatar: string
        }
      }
    }
  }
}

interface PostGridViewProps {
  posts: Post[]
}

export function PostGridView({ posts }: PostGridViewProps) {
  return (
    <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      {posts.map((post) => {
        const { id, attributes } = post
        return (
          <article
            key={id}
            className="group relative flex flex-col space-y-2 rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-border"
          >
            <div className="relative aspect-video overflow-hidden rounded-md">
              <Image
                src={attributes.cover?.data?.attributes?.url || "/placeholder.svg?key=default-post"}
                alt={attributes.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 space-y-4 pt-4">
              <div className="space-y-2">
                <Link href={`/blog/${attributes.slug}`}>
                  <h2 className="text-xl font-bold leading-tight tracking-tight text-foreground">{attributes.title}</h2>
                </Link>
                <p className="text-muted-foreground">{attributes.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full">
                    <Image
                      src={attributes.author?.data?.attributes?.avatar || "/diverse-avatars.png"}
                      alt={attributes.author?.data?.attributes?.name || "Author"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">{attributes.author?.data?.attributes?.name || "Author"}</span>
                </div>
                <time dateTime={attributes.publishedAt} className="text-sm text-muted-foreground">
                  {formatDate(attributes.publishedAt)}
                </time>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
