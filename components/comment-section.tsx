"use client"

import type React from "react"

import { useState } from "react"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addComment } from "@/lib/strapi"
import Image from "next/image"

interface CommentSectionProps {
  postId: number
  comments: any[]
}

export default function CommentSection({ postId, comments: initialComments = [] }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!newComment.trim()) return

    setIsSubmitting(true)

    try {
      // In a real app, you'd get the user ID from authentication
      // For now, we'll use a placeholder user ID
      const result = await addComment(postId, {
        author: 1, // Placeholder user ID
        content: newComment,
      })

      // Add the new comment to the list
      if (result && result.data) {
        setComments([...comments, result.data])
        setNewComment("")
      } else {
        setError("Failed to add comment. Please try again.")
      }
    } catch (error) {
      console.error("Failed to add comment:", error)
      setError("Failed to add comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Comments ({comments.length})</h2>

      <form onSubmit={handleSubmitComment} className="mb-12">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-4"
          rows={4}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      <div className="space-y-8">
        {comments.length > 0 ? (
          comments.map((comment) => {
            const { id, attributes } = comment
            return (
              <div key={id} className="flex gap-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={attributes.author?.data?.attributes?.avatar || "/diverse-avatars.png"}
                    alt={attributes.author?.data?.attributes?.name || "Anonymous"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{attributes.author?.data?.attributes?.name || "Anonymous"}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(attributes.createdAt)}</span>
                  </div>
                  <p className="text-sm">{attributes.content}</p>
                </div>
              </div>
            )
          })
        ) : (
          <p className="text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  )
}
