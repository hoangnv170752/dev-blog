import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { searchPosts } from "@/lib/strapi"

export interface SearchPageProps {
  searchParams: {
    q?: string
    page?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""
  const currentPage = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const pageSize = 9

  // Search posts from Strapi with error handling
  const postsData = await searchPosts(query, currentPage, pageSize)
  const posts = postsData?.data || []
  const pagination = postsData?.meta?.pagination || { page: 1, pageCount: 0, total: 0 }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-muted-foreground mb-8">
        {pagination.total} {pagination.total === 1 ? "result" : "results"} for "{query}"
      </p>

      {posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                      <h2 className="text-lg font-bold leading-tight tracking-tight text-foreground">
                        {attributes.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2">{attributes.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative h-6 w-6 overflow-hidden rounded-full">
                        <Image
                          src={attributes.author?.data?.attributes?.avatar || "/diverse-avatars.png"}
                          alt={attributes.author?.data?.attributes?.name || "Author"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {attributes.author?.data?.attributes?.name || "Author"}
                      </span>
                    </div>
                    <time dateTime={attributes.publishedAt} className="text-xs text-muted-foreground">
                      {formatDate(attributes.publishedAt)}
                    </time>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No posts found matching your search. Try different keywords.</p>
        </div>
      )}

      {pagination.pageCount > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" size="sm" disabled={currentPage <= 1} asChild>
            {currentPage > 1 ? (
              <Link href={`/search?q=${query}&page=${currentPage - 1}`}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Link>
            ) : (
              <span>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </span>
            )}
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentPage} of {pagination.pageCount}
          </span>
          <Button variant="outline" size="sm" disabled={currentPage >= pagination.pageCount} asChild>
            {currentPage < pagination.pageCount ? (
              <Link href={`/search?q=${query}&page=${currentPage + 1}`}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            ) : (
              <span>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
