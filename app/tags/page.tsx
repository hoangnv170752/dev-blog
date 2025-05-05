import Link from "next/link"
import { getAllTags } from "@/lib/strapi"
import { TagCloud } from "@/components/tag-cloud"

interface TagItem {
  name: string;
  slug: string;
  count: number;
}

export default async function TagsPage() {
  const tagsData = await getAllTags()
  const tags = tagsData?.data || []

  // Transform tags data for display
  const tagsList: TagItem[] = tags
    .map((tag: any) => ({
      name: tag.attributes.name,
      slug: tag.attributes.slug,
      count: tag.attributes.articles?.data?.length || 0,
    }))
    .sort((a: TagItem, b: TagItem) => b.count - a.count)

  return (
    <div className="w-full bg-background">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-4">Tags</h1>
          <div className="w-20 h-1 bg-primary mb-16"></div>

          {tagsList.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mb-16 animate-fadeIn">
              {tagsList.map((tag: TagItem, index: number) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="animate-tagAppear"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <span className="inline-flex items-center rounded-md border border-border/50 px-4 py-2 text-sm font-medium transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105">
                    {tag.name} ({tag.count})
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg max-w-md mb-16">
              <p className="text-muted-foreground">
                No tags found. Please check your Strapi connection or add some tags.
              </p>
            </div>
          )}

          <TagCloud tags={tagsList} />

          <div className="mt-16 max-w-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">Discover Content by Tags</h2>
            <p className="text-muted-foreground">
              Browse our collection of articles by tags to find the content that interests you the most. Click on any tag to see related articles.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
