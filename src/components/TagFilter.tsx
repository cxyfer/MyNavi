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
            type="button"
            onClick={() => onToggle(tag)}
            className={`
              relative px-3 py-1.5 text-sm font-medium
              cyber-chamfer
              transition-all duration-150 ease-out
              focus:outline-none focus:ring-2 focus:ring-[var(--cyber-accent)] focus:ring-offset-2 focus:ring-offset-[var(--cyber-background)]
              ${isSelected
                ? 'cyber-chamfer-selected cyber-glow bg-[var(--cyber-accent-20)] text-[var(--cyber-accent)] border border-[var(--cyber-accent)]'
                : 'bg-transparent text-[var(--cyber-foreground)] border border-[var(--cyber-border)] hover:border-[var(--cyber-accent-50)] hover:text-[var(--cyber-accent)]'
              }
            `}
            aria-pressed={isSelected}
          >
            <span className="text-[var(--cyber-accent)]">#</span>
            {tag}
          </button>
        )
      })}
      {selectedTags.size > 0 && (
        <button
          type="button"
          onClick={() => {
            selectedTags.forEach((tag) => onToggle(tag))
          }}
          className="
            px-3 py-1.5 text-xs
            text-[var(--cyber-muted)]
            hover:text-[var(--cyber-accent)]
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-[var(--cyber-accent)] focus:ring-offset-2 focus:ring-offset-[var(--cyber-background)]
          "
        >
          清除 ({selectedTags.size})
        </button>
      )}
    </div>
  )
}
