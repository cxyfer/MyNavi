import { useState, useRef, useEffect, useCallback } from 'react'
import { Menu } from 'lucide-react'
import { SearchBar } from './SearchBar'
import { TagFilter } from './TagFilter'
import { ViewToggle } from './ViewToggle'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/button'
import type { Theme } from '@/hooks/useTheme'

interface ControlBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  tags: string[]
  selectedTags: Set<string>
  onToggleTag: (tag: string) => void
  viewMode: 'card' | 'list'
  onViewModeChange: (mode: 'card' | 'list') => void
  theme: Theme
  onThemeToggle: () => void
  onMenuClick?: () => void
}

export function ControlBar({
  searchQuery,
  onSearchChange,
  tags,
  selectedTags,
  onToggleTag,
  viewMode,
  onViewModeChange,
  theme,
  onThemeToggle,
  onMenuClick,
}: ControlBarProps) {
  const [isTagExpanded, setIsTagExpanded] = useState(false)
  const collapseTimerRef = useRef<number | null>(null)

  const handleSearchFocusChange = useCallback((focused: boolean) => {
    if (focused) {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current)
        collapseTimerRef.current = null
      }
      setIsTagExpanded(true)
    } else {
      collapseTimerRef.current = window.setTimeout(() => {
        setIsTagExpanded(false)
        collapseTimerRef.current = null
      }, 300)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-4 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="flex flex-col sm:flex-row gap-3">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
            aria-label="開啟選單"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <SearchBar value={searchQuery} onChange={onSearchChange} onFocusChange={handleSearchFocusChange} />
        <div className="flex items-center gap-2">
          <ViewToggle value={viewMode} onChange={onViewModeChange} />
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </div>
      <TagFilter tags={tags} selectedTags={selectedTags} onToggle={onToggleTag} isExpanded={isTagExpanded} />
    </div>
  )
}
