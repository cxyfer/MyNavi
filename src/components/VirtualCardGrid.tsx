import { useRef, useMemo, useEffect, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { FlattenedItem, LinkItem } from '@/types/link'
import { LinkCard } from './LinkCard'
import { GroupHeader } from './GroupHeader'

interface VirtualCardGridProps {
  items: FlattenedItem[]
  searchQuery: string
  collapsedGroups: Set<string>
  onToggleGroup: (group: string) => void
  onTagClick: (tag: string) => void
}

const CARD_MIN_WIDTH = 280
const CARD_HEIGHT = 140
const GAP = 16

interface GridRow {
  type: 'header' | 'cards'
  group?: string
  itemCount?: number
  items?: LinkItem[]
}

export function VirtualCardGrid({
  items,
  searchQuery,
  collapsedGroups,
  onToggleGroup,
  onTagClick,
}: VirtualCardGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    const updateColumns = () => {
      if (parentRef.current) {
        const width = parentRef.current.clientWidth
        const newColumns = Math.max(1, Math.floor((width + GAP) / (CARD_MIN_WIDTH + GAP)))
        setColumns(newColumns)
      }
    }

    updateColumns()
    const observer = new ResizeObserver(updateColumns)
    if (parentRef.current) {
      observer.observe(parentRef.current)
    }
    return () => observer.disconnect()
  }, [])

  const rows = useMemo<GridRow[]>(() => {
    const result: GridRow[] = []
    let currentCards: LinkItem[] = []
    let currentGroup = ''

    for (const item of items) {
      if (item.type === 'header') {
        if (currentCards.length > 0) {
          const rowCount = Math.ceil(currentCards.length / columns)
          for (let i = 0; i < rowCount; i++) {
            result.push({
              type: 'cards',
              items: currentCards.slice(i * columns, (i + 1) * columns),
            })
          }
          currentCards = []
        }
        result.push({
          type: 'header',
          group: item.group,
          itemCount: item.itemCount,
        })
        currentGroup = item.group
      } else {
        currentCards.push(item.data)
      }
    }

    if (currentCards.length > 0) {
      const rowCount = Math.ceil(currentCards.length / columns)
      for (let i = 0; i < rowCount; i++) {
        result.push({
          type: 'cards',
          items: currentCards.slice(i * columns, (i + 1) * columns),
        })
      }
    }

    return result
  }, [items, columns])

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => (rows[index]?.type === 'header' ? 48 : CARD_HEIGHT + GAP),
    overscan: 3,
  })

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto px-4"
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
          const row = rows[virtualItem.index]
          if (!row) return null

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
              {row.type === 'header' ? (
                <GroupHeader
                  group={row.group!}
                  itemCount={row.itemCount!}
                  isCollapsed={collapsedGroups.has(row.group!)}
                  onToggle={() => onToggleGroup(row.group!)}
                />
              ) : (
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  }}
                >
                  {row.items?.map((item) => (
                    <LinkCard
                      key={item.id}
                      item={item}
                      searchQuery={searchQuery}
                      onTagClick={onTagClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
