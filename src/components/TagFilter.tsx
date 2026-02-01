import { Badge } from '@/components/ui/badge'

interface TagFilterProps {
  tags: string[]
  selectedTags: Set<string>
  onToggle: (tag: string) => void
}

export function TagFilter({ tags, selectedTags, onToggle }: TagFilterProps) {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = selectedTags.has(tag)
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className="cursor-pointer"
            aria-pressed={isSelected}
          >
            <Badge
              variant={isSelected ? 'default' : 'outline'}
              className="transition-colors"
            >
              {tag}
            </Badge>
          </button>
        )
      })}
      {selectedTags.size > 0 && (
        <button
          onClick={() => {
            selectedTags.forEach((tag) => onToggle(tag))
          }}
          className="text-xs text-muted-foreground hover:text-foreground underline"
        >
          清除 ({selectedTags.size})
        </button>
      )}
    </div>
  )
}
