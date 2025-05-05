import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getAllPosts } from "@/lib/strapi"
import { PostsSection } from "@/components/posts-section"

export default async function Home() {
  // Fetch the latest posts from Strapi with error handling
  const postsData = await getAllPosts(1, 4)
  const posts = postsData?.data || []

  return (
    <div className="bg-background w-full">
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-2">
            Latest Articles
          </h1>
          <div className="w-20 h-1 bg-primary"></div>
        </div>

        <Suspense fallback={null}>
          <PostsSection posts={posts} />
        </Suspense>

        <div className="mt-12 flex justify-end">
          <Button asChild variant="ghost" className="group">
            <Link href="/blog">
              All Posts <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
