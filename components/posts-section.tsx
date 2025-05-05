"use client"

import { useState } from "react"
import { PostViewToggle } from "@/components/post-view-toggle"
import { PostGridView } from "@/components/post-grid-view"
import { PostListView } from "@/components/post-list-view"

type ViewMode = "grid" | "list"

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

interface PostsSectionProps {
  posts: Post[]
}

export function PostsSection({ posts }: PostsSectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  if (posts.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No posts found. Please check your Strapi connection or add some posts.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-6">
        <PostViewToggle onViewChange={setViewMode} initialView={viewMode} />
      </div>

      {viewMode === "grid" ? <PostGridView posts={posts} /> : <PostListView posts={posts} />}
    </div>
  )
}
