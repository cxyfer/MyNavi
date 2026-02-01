import { useState, useEffect, useMemo } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import type { LinkItem } from '@/types/link'

interface CommandPaletteProps {
  items: LinkItem[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (item: LinkItem) => void
}

const MAX_RESULTS = 50

export function CommandPalette({
  items,
  isOpen,
  onOpenChange,
  onSelect,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items.slice(0, MAX_RESULTS)

    const q = query.toLowerCase()
    return items
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
      )
      .slice(0, MAX_RESULTS)
  }, [items, query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(!isOpen)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onOpenChange])

  const handleSelect = (itemId: string) => {
    const item = items.find((i) => i.id === itemId)
    if (item) {
      onSelect(item)
      onOpenChange(false)
      setQuery('')
    }
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="搜尋連結... (Ctrl+K)"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>沒有找到結果</CommandEmpty>
        <CommandGroup>
          {filteredItems.map((item) => (
            <CommandItem
              key={item.id}
              value={item.id}
              onSelect={() => handleSelect(item.id)}
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="font-medium">{item.title}</span>
                <span className="text-muted-foreground text-sm truncate flex-1">
                  {item.description}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
