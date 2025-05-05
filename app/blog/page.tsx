import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getAllPosts, getAllCategories } from "@/lib/strapi"

// Define the props type for the page component
export interface BlogPageProps {
  searchParams: {
    page?: string
  }
}

// Define types for the data
interface CategoryItem {
  name: string;
  slug: string;
  count: number;
}

interface PostAttributes {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  cover?: {
    data?: {
      attributes?: {
        url?: string;
      };
    };
  };
  author?: {
    data?: {
      attributes?: {
        name?: string;
        avatar?: string;
      };
    };
  };
}

interface PostItem {
  id: number;
  attributes: PostAttributes;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const pageSize = 9

  // Fetch posts and categories from Strapi with error handling
  const postsData = await getAllPosts(currentPage, pageSize)
  const posts = postsData?.data || []
  const pagination = postsData?.meta?.pagination || { page: 1, pageCount: 1, total: 0 }

  const categoriesData = await getAllCategories()
  const categories = categoriesData?.data || []

  // Group categories by count for the sidebar
  const categoriesList = categories
    .map((category: any): CategoryItem => ({
      name: category.attributes?.name || 'Uncategorized',
      slug: category.attributes?.slug || 'uncategorized',
      count: category.attributes?.articles?.data?.length || 0,
    }))
    .sort((a: CategoryItem, b: CategoryItem) => b.count - a.count)

  return (
    <div className="w-full bg-background">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0">
            <h2 className="text-2xl font-bold mb-4">ALL POSTS</h2>
            <div className="space-y-2">
              {categoriesList.length > 0 ? (
                categoriesList.map((category: CategoryItem) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="block text-sm hover:text-primary"
                  >
                    {category.name} ({category.count})
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No categories found</p>
              )}
            </div>
          </aside>
          <div className="flex-1">
            {posts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post: PostItem) => {
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
                <p className="text-muted-foreground">
                  No posts found. Please check your Strapi connection or add some posts.
                </p>
              </div>
            )}

            {pagination.pageCount > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <Button variant="outline" size="sm" disabled={currentPage <= 1} asChild>
                  {currentPage > 1 ? (
                    <Link href={`/blog?page=${currentPage - 1}`}>
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
                    <Link href={`/blog?page=${currentPage + 1}`}>
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
        </div>
      </div>
    </div>
  )
}
