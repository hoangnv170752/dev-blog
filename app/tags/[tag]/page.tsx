import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { notFound } from "next/navigation"

// This would normally come from a database or CMS
const allPosts = [
  {
    id: "1",
    title: "Secure API Gateway with Cognito Authorizer",
    excerpt: "Learn how to secure your API Gateway endpoints using Amazon Cognito as an authorizer.",
    coverImage: "/placeholder.svg?key=q9ejl",
    date: "2025-04-18",
    author: {
      name: "John Smith",
      avatar: "/diverse-avatars.png",
    },
    category: "AWS-DVA",
  },
  {
    id: "2",
    title: "Low-Code/No-Code End-to-End Machine Learning for Startups",
    excerpt:
      "Discover how to build end-to-end machine learning solutions without writing much code using Amazon SageMaker Canvas.",
    coverImage: "/placeholder.svg?key=ul8k5",
    date: "2025-04-06",
    author: {
      name: "Jane Doe",
      avatar: "/diverse-avatars.png",
    },
    category: "MACHINE-LEARNING",
  },
  {
    id: "3",
    title: "Using FMs Stable Diffusion in AWS Bedrock to Generate Images",
    excerpt: "Learn how to generate high-quality images using Stable Diffusion models in AWS Bedrock.",
    coverImage: "/placeholder.svg?key=2kr4w",
    date: "2025-03-26",
    author: {
      name: "Alex Johnson",
      avatar: "/diverse-avatars.png",
    },
    category: "GENERATIVE-AI",
  },
]

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = params.tag.toUpperCase()

  // Filter posts by tag
  const posts = allPosts.filter((post) => post.category.toLowerCase() === tag.toLowerCase())

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">
        {tag} ({posts.length})
      </h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group relative flex flex-col space-y-2 rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-border"
          >
            <div className="relative aspect-video overflow-hidden rounded-md">
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 space-y-4 pt-4">
              <div className="space-y-2">
                <Link href={`/blog/${post.id}`}>
                  <h2 className="text-lg font-bold leading-tight tracking-tight text-foreground">{post.title}</h2>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative h-6 w-6 overflow-hidden rounded-full">
                    <Image
                      src={post.author.avatar || "/placeholder.svg"}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-medium">{post.author.name}</span>
                </div>
                <time dateTime={post.date} className="text-xs text-muted-foreground">
                  {formatDate(post.date)}
                </time>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">1 of 1</span>
        <Button variant="outline" size="sm" disabled>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
