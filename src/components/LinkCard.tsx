import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { getIconFallback } from '@/lib/utils'
import type { LinkItem } from '@/types/link'

interface LinkCardProps {
  item: LinkItem
  searchQuery?: string
  onTagClick?: (tag: string) => void
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text

  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export function LinkCard({ item, searchQuery = '', onTagClick }: LinkCardProps) {
  const [iconError, setIconError] = useState(false)

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {item.icon && !iconError ? (
            <img
              src={item.icon}
              alt=""
              className="w-10 h-10 rounded-md object-contain bg-muted"
              onError={() => setIconError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
              {getIconFallback(item.title)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">
              {highlightText(item.title, searchQuery)}
            </h3>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {highlightText(item.description, searchQuery)}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {item.tags.map((tag) => (
              <span
                key={tag}
                role="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onTagClick?.(tag)
                }}
                className="
                  px-2 py-0.5 text-xs cursor-pointer
                  cyber-chamfer
                  bg-[var(--cyber-muted)]
                  text-[var(--cyber-foreground)]
                  border border-[var(--cyber-border)]
                  hover:border-[var(--cyber-accent-50)]
                  hover:cyber-glow
                  hover:text-[var(--cyber-accent)]
                  transition-all duration-150 ease-out
                "
              >
                <span className="text-[var(--cyber-accent)]">#</span>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  )
}
