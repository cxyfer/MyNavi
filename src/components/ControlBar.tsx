import { SearchBar } from './SearchBar'
import { TagFilter } from './TagFilter'
import { ViewToggle } from './ViewToggle'
import { ThemeToggle } from './ThemeToggle'
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
}: ControlBarProps) {
  return (
    <div className="space-y-4 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={searchQuery} onChange={onSearchChange} />
        <div className="flex items-center gap-2">
          <ViewToggle value={viewMode} onChange={onViewModeChange} />
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </div>
      <TagFilter tags={tags} selectedTags={selectedTags} onToggle={onToggleTag} />
    </div>
  )
}
