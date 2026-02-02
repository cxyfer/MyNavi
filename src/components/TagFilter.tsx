import { cn } from '@/lib/utils'

interface TagFilterProps {
  tags: string[]
  selectedTags: Set<string>
  onToggle: (tag: string) => void
  isExpanded?: boolean
}

export function TagFilter({ tags, selectedTags, onToggle, isExpanded = true }: TagFilterProps) {
  if (tags.length === 0) return null

  const selectedTagList = tags.filter(tag => selectedTags.has(tag))
  const unselectedTagList = tags.filter(tag => !selectedTags.has(tag))

  const tagButton = (tag: string, isSelected: boolean) => (
    <button
      key={tag}
      type="button"
      onClick={() => onToggle(tag)}
      className={`
        relative px-3 py-1.5 text-sm font-medium
        cyber-chamfer
        transition-all duration-150 ease-out
        focus:outline-none focus:ring-2 focus:ring-[hsl(var(--cyber-accent))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--cyber-background))]
        ${isSelected
          ? 'cyber-chamfer-selected cyber-glow bg-[hsl(var(--cyber-accent-20))] text-[hsl(var(--cyber-accent))] border border-[hsl(var(--cyber-accent))]'
          : 'bg-transparent text-[hsl(var(--cyber-foreground))] border border-[hsl(var(--cyber-border))] hover:border-[hsl(var(--cyber-accent-50))] hover:text-[hsl(var(--cyber-accent))]'
        }
      `}
      aria-pressed={isSelected}
    >
      <span className="text-[hsl(var(--cyber-accent))]">#</span>
      {tag}
    </button>
  )

  return (
    <div className="space-y-2">
      {selectedTagList.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTagList.map(tag => tagButton(tag, true))}
          <button
            type="button"
            onClick={() => selectedTags.forEach(tag => onToggle(tag))}
            className="
              px-3 py-1.5 text-xs
              text-[hsl(var(--cyber-muted))]
              hover:text-[hsl(var(--cyber-accent))]
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-[hsl(var(--cyber-accent))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--cyber-background))]
            "
          >
            清除 ({selectedTags.size})
          </button>
        </div>
      )}

      {!isExpanded && selectedTags.size === 0 && (
        <p className="text-sm text-muted-foreground">
          點擊搜尋框以瀏覽標籤
        </p>
      )}

      <div
        className={cn(
          "transition-all duration-300 ease-out overflow-hidden",
          isExpanded && unselectedTagList.length > 0
            ? "max-h-48 opacity-100"
            : "max-h-0 opacity-0"
        )}
        aria-hidden={!isExpanded}
        {...(!isExpanded && { inert: true })}
      >
        <div className="flex flex-wrap gap-2 overflow-y-auto max-h-48">
          {unselectedTagList.map(tag => tagButton(tag, false))}
        </div>
      </div>
    </div>
  )
}
