"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

interface Tag {
  name: string
  slug: string
  count: number
}

interface TagCloudProps {
  tags: Tag[]
}

export function TagCloud({ tags }: TagCloudProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [animatedTags, setAnimatedTags] = useState<Array<Tag & { x: number; y: number; size: number; speed: number }>>(
    [],
  )

  useEffect(() => {
    if (!containerRef.current || tags.length === 0) return

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [tags])

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0 || tags.length === 0) return

    // Create animated tags with random positions and sizes
    const maxCount = Math.max(...tags.map((tag) => tag.count))
    const minSize = 0.8
    const maxSize = 1.8

    const newAnimatedTags = tags.map((tag) => {
      const size = minSize + (tag.count / maxCount) * (maxSize - minSize)
      return {
        ...tag,
        x: Math.random() * (dimensions.width - 100),
        y: Math.random() * (dimensions.height - 40),
        size,
        speed: 0.2 + Math.random() * 0.3,
      }
    })

    setAnimatedTags(newAnimatedTags)

    // Animation loop
    let animationFrameId: number
    let lastTime = 0

    const animate = (time: number) => {
      if (lastTime === 0) lastTime = time
      const deltaTime = time - lastTime
      lastTime = time

      setAnimatedTags((prevTags) =>
        prevTags.map((tag) => {
          let newX = tag.x + tag.speed * Math.cos(time / 2000) * 2
          let newY = tag.y + tag.speed * Math.sin(time / 2000) * 2

          // Boundary check
          if (newX < 0) newX = dimensions.width - 80
          if (newX > dimensions.width - 80) newX = 0
          if (newY < 0) newY = dimensions.height - 30
          if (newY > dimensions.height - 30) newY = 0

          return {
            ...tag,
            x: newX,
            y: newY,
          }
        }),
      )

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [dimensions, tags])

  const handleTagClick = (slug: string) => {
    router.push(`/tags/${slug}`)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl h-[300px] rounded-lg bg-muted/30 overflow-hidden"
      aria-hidden="true"
    >
      {animatedTags.map((tag, index) => (
        <button
          key={`${tag.slug}-${index}`}
          onClick={() => handleTagClick(tag.slug)}
          className="absolute cursor-pointer transition-colors hover:text-primary"
          style={{
            left: `${tag.x}px`,
            top: `${tag.y}px`,
            fontSize: `${tag.size}rem`,
            opacity: 0.7 + ((tag.size - 0.8) / (1.8 - 0.8)) * 0.3,
            transition: "color 0.3s ease",
          }}
        >
          {tag.name}
        </button>
      ))}
    </div>
  )
}
