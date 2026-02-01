import type { LinkItem, FlattenedItem } from '@/types/link'

export function flattenItems(
  items: LinkItem[],
  collapsedGroups: Set<string> = new Set()
): FlattenedItem[] {
  const grouped = new Map<string, LinkItem[]>()

  for (const item of items) {
    const list = grouped.get(item.group) ?? []
    list.push(item)
    grouped.set(item.group, list)
  }

  const result: FlattenedItem[] = []
  const groupNames = Array.from(grouped.keys())

  for (const group of groupNames) {
    const groupItems = grouped.get(group)!
    result.push({
      type: 'header',
      group,
      itemCount: groupItems.length,
    })

    if (!collapsedGroups.has(group)) {
      for (const item of groupItems) {
        result.push({ type: 'item', data: item })
      }
    }
  }

  return result
}
