"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"

type ViewMode = "grid" | "list"

interface PostViewToggleProps {
  onViewChange: (mode: ViewMode) => void
  initialView?: ViewMode
}

export function PostViewToggle({ onViewChange, initialView = "grid" }: PostViewToggleProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialView)

  useEffect(() => {
    // Load saved preference from localStorage if available
    const savedView = localStorage.getItem("blogViewMode") as ViewMode | null
    if (savedView) {
      setViewMode(savedView)
      onViewChange(savedView)
    }
  }, [onViewChange])

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem("blogViewMode", mode)
    onViewChange(mode)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-1">View:</span>
      <div className="flex border rounded-md overflow-hidden">
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-none px-3 ${
            viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-transparent"
          }`}
          onClick={() => handleViewChange("grid")}
          aria-label="Grid view"
          title="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-none px-3 ${
            viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-transparent"
          }`}
          onClick={() => handleViewChange("list")}
          aria-label="List view"
          title="List view"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
