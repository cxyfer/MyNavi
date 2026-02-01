import type { LinkItem, FlattenedItem } from '@/types/link'
import { flattenItems } from './flatten'

export interface FilterOptions {
  items: LinkItem[]
  searchQuery: string
  selectedTags: Set<string>
  collapsedGroups: Set<string>
  searchResults: LinkItem[]
}

export function filterItems(options: FilterOptions): FlattenedItem[] {
  const { items, searchQuery, selectedTags, collapsedGroups, searchResults } = options

  let filtered = items

  // Tag filter (OR logic)
  if (selectedTags.size > 0) {
    filtered = filtered.filter((item) =>
      item.tags.some((tag) => selectedTags.has(tag))
    )
  }

  // Search filter (AND with tags)
  if (searchQuery.trim()) {
    const searchIds = new Set(searchResults.map((item) => item.id))
    filtered = filtered.filter((item) => searchIds.has(item.id))
  }

  return flattenItems(filtered, collapsedGroups)
}

export function extractAllTags(items: LinkItem[]): string[] {
  const tagSet = new Set<string>()
  for (const item of items) {
    for (const tag of item.tags) {
      tagSet.add(tag)
    }
  }
  return Array.from(tagSet).sort()
}
