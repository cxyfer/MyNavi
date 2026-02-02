import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { FlattenedItem } from '@/types/link'
import { LinkRow } from './LinkRow'
import { GroupHeader } from './GroupHeader'

interface VirtualListProps {
  items: FlattenedItem[]
  searchQuery: string
  collapsedGroups: Set<string>
  onToggleGroup: (group: string) => void
  onTagClick: (tag: string) => void
}

const ESTIMATED_ITEM_HEIGHT = 60

export function VirtualList({
  items,
  searchQuery,
  collapsedGroups,
  onToggleGroup,
  onTagClick,
}: VirtualListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_ITEM_HEIGHT,
    measureElement: (el) => el.getBoundingClientRect().height,
    overscan: 5,
  })

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto"
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index]
          if (!item) return null

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {item.type === 'header' ? (
                <GroupHeader
                  group={item.group}
                  itemCount={item.itemCount}
                  isCollapsed={collapsedGroups.has(item.group)}
                  onToggle={() => onToggleGroup(item.group)}
                />
              ) : (
                <LinkRow
                  item={item.data}
                  searchQuery={searchQuery}
                  onTagClick={onTagClick}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
