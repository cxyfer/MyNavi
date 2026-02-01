import type { FlattenedItem } from '@/types/link'
import { VirtualCardGrid } from './VirtualCardGrid'
import { VirtualList } from './VirtualList'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'

interface ContentAreaProps {
  items: FlattenedItem[]
  viewMode: 'card' | 'list'
  searchQuery: string
  collapsedGroups: Set<string>
  error: Error | null
  onToggleGroup: (group: string) => void
  onTagClick: (tag: string) => void
  onClearFilters: () => void
  onRetry: () => void
}

export function ContentArea({
  items,
  viewMode,
  searchQuery,
  collapsedGroups,
  error,
  onToggleGroup,
  onTagClick,
  onClearFilters,
  onRetry,
}: ContentAreaProps) {
  if (error) {
    return <ErrorState message={error.message} onRetry={onRetry} />
  }

  if (items.length === 0) {
    return <EmptyState onClear={onClearFilters} />
  }

  return viewMode === 'card' ? (
    <VirtualCardGrid
      items={items}
      searchQuery={searchQuery}
      collapsedGroups={collapsedGroups}
      onToggleGroup={onToggleGroup}
      onTagClick={onTagClick}
    />
  ) : (
    <VirtualList
      items={items}
      searchQuery={searchQuery}
      collapsedGroups={collapsedGroups}
      onToggleGroup={onToggleGroup}
      onTagClick={onTagClick}
    />
  )
}
