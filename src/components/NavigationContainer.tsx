import { useState, useMemo, useCallback } from 'react'
import { useLinks } from '@/hooks/useLinks'
import { useNaviStore } from '@/hooks/useNaviStore'
import { useFuzzySearch } from '@/hooks/useFuzzySearch'
import { filterItems, extractAllTags } from '@/lib/filter'
import { ControlBar } from './ControlBar'
import { ContentArea } from './ContentArea'
import { CommandPalette } from './CommandPalette'
import type { LinkItem } from '@/types/link'
import type { Theme } from '@/hooks/useTheme'

interface NavigationContainerProps {
  theme: Theme
  onThemeToggle: () => void
}

export function NavigationContainer({
  theme,
  onThemeToggle,
}: NavigationContainerProps) {
  const { items, loading, error, refetch } = useLinks()
  const {
    searchQuery,
    selectedTags,
    viewMode,
    collapsedGroups,
    setSearchQuery,
    toggleTag,
    clearFilters,
    setViewMode,
    toggleGroup,
  } = useNaviStore()

  const [commandOpen, setCommandOpen] = useState(false)

  const searchResults = useFuzzySearch(items, searchQuery)

  const filteredItems = useMemo(
    () =>
      filterItems({
        items,
        searchQuery,
        selectedTags,
        collapsedGroups,
        searchResults,
      }),
    [items, searchQuery, selectedTags, collapsedGroups, searchResults]
  )

  const allTags = useMemo(() => extractAllTags(items), [items])

  const handleTagClick = useCallback(
    (tag: string) => {
      if (!selectedTags.has(tag)) {
        toggleTag(tag)
      }
    },
    [selectedTags, toggleTag]
  )

  const handleCommandSelect = useCallback((item: LinkItem) => {
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">載入中...</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <ControlBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        tags={allTags}
        selectedTags={selectedTags}
        onToggleTag={toggleTag}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        theme={theme}
        onThemeToggle={onThemeToggle}
      />
      <div className="flex-1 overflow-hidden">
        <ContentArea
          items={filteredItems}
          viewMode={viewMode}
          searchQuery={searchQuery}
          collapsedGroups={collapsedGroups}
          error={error}
          onToggleGroup={toggleGroup}
          onTagClick={handleTagClick}
          onClearFilters={clearFilters}
          onRetry={refetch}
        />
      </div>
      <CommandPalette
        items={items}
        isOpen={commandOpen}
        onOpenChange={setCommandOpen}
        onSelect={handleCommandSelect}
      />
    </div>
  )
}
