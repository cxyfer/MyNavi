import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getIconFallback } from '@/lib/utils'
import type { LinkItem } from '@/types/link'

interface LinkRowProps {
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

export function LinkRow({ item, searchQuery = '', onTagClick }: LinkRowProps) {
  const [iconError, setIconError] = useState(false)

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors border-b last:border-b-0"
    >
      <div className="flex-shrink-0">
        {item.icon && !iconError ? (
          <img
            src={item.icon}
            alt=""
            className="w-8 h-8 rounded object-contain bg-muted"
            onError={() => setIconError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
            {getIconFallback(item.title)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">
              {highlightText(item.title, searchQuery)}
            </h3>
            <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          <p className="text-sm text-muted-foreground truncate hidden sm:block">
            {highlightText(item.description, searchQuery)}
          </p>
        </div>
        <div className="hidden md:flex flex-wrap gap-1 flex-shrink-0 max-w-[200px]">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-secondary/80"
              onClick={(e) => {
                e.preventDefault()
                onTagClick?.(tag)
              }}
            >
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{item.tags.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </a>
  )
}
