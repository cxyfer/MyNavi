import { useMemo, useRef } from 'react'
import Fuse from 'fuse.js'
import type { LinkItem } from '@/types/link'

interface UseFuzzySearchOptions {
  threshold?: number
  keys?: string[]
}

export function useFuzzySearch(
  items: LinkItem[],
  query: string,
  options: UseFuzzySearchOptions = {}
): LinkItem[] {
  const { threshold = 0.4, keys = ['title', 'description', 'tags'] } = options

  const fuseRef = useRef<Fuse<LinkItem> | null>(null)

  const results = useMemo(() => {
    if (!query.trim()) {
      return items
    }

    fuseRef.current = new Fuse(items, {
      threshold,
      keys,
      includeScore: false,
    })

    return fuseRef.current.search(query).map((result) => result.item)
  }, [items, query, threshold, keys])

  return results
}
