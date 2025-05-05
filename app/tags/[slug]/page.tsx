import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { notFound } from "next/navigation"
import { getPostsByTag } from "@/lib/strapi"

interface PostAttributes {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  cover?: {
    data?: {
      attributes?: {
        url: string;
      };
    };
  };
  author?: {
    data?: {
      attributes?: {
        name: string;
        avatar?: {
          data?: {
            attributes?: {
              url: string;
            };
          };
        };
      };
    };
  };
  tags?: {
    data?: {
      attributes?: {
        name: string;
        slug: string;
      };
    }[];
  };
}

interface Post {
  id: string;
  attributes: PostAttributes;
}

interface PostsData {
  data: Post[];
  meta: {
    pagination: {
      page: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface TagPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const currentPage = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const pageSize = 9

  // Fetch posts by tag from Strapi with error handling
  const postsData: PostsData = await getPostsByTag(params.slug, currentPage, pageSize)

  if (!postsData || postsData.data.length === 0) {
    notFound()
  }

  const posts = postsData.data
  const pagination = postsData.meta?.pagination || { page: 1, pageCount: 1, total: 0 }

  // Get tag name from the first post or use the slug
  const tagName =
    posts[0]?.attributes.tags?.data?.find((tag: any) => tag.attributes.slug === params.slug)?.attributes.name ||
    params.slug.toUpperCase()

  return (
    <div className="w-full bg-background">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8">
          {tagName} ({pagination.total})
        </h1>

        {posts.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: Post) => {
              const { id, attributes } = post
              return (
                <article
                  key={id}
                  className="group relative flex flex-col space-y-2 rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-border"
                >
                  <div className="relative aspect-video overflow-hidden rounded-md">
                    <Link href={`/blog/${attributes.slug}`}>
                      <Image
                        src={
                          attributes.cover?.data?.attributes?.url ||
                          "/placeholder.svg?height=720&width=1280&query=blog"
                        }
                        alt={attributes.title}
                        fill
                        className="object-cover transition-all group-hover:scale-105"
                      />
                    </Link>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h2 className="text-xl font-bold tracking-tight">
                      <Link href={`/blog/${attributes.slug}`}>{attributes.title}</Link>
                    </h2>
                    <p className="text-muted-foreground line-clamp-2">{attributes.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <Image
                          src={
                            attributes.author?.data?.attributes?.avatar?.data?.attributes?.url ||
                            "/placeholder.svg?height=32&width=32&query=avatar"
                          }
                          alt={attributes.author?.data?.attributes?.name || "Author"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span>{attributes.author?.data?.attributes?.name || "Anonymous"}</span>
                    </div>
                    <time dateTime={attributes.publishedAt}>{formatDate(attributes.publishedAt)}</time>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No posts found for this tag.</p>
          </div>
        )}

        {pagination.pageCount > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              asChild={currentPage > 1}
            >
              {currentPage > 1 ? (
                <Link href={`/tags/${params.slug}?page=${currentPage - 1}`}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Link>
              ) : (
                <>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </>
              )}
            </Button>
            <Button
              variant="outline"
              disabled={currentPage >= pagination.pageCount}
              asChild={currentPage < pagination.pageCount}
            >
              {currentPage < pagination.pageCount ? (
                <Link href={`/tags/${params.slug}?page=${currentPage + 1}`}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
