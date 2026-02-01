export interface LinkItem {
  id: string
  title: string
  description: string
  url: string
  tags: string[]
  group: string
  icon?: string
}

export interface LinkGroup {
  name: string
  items: LinkItem[]
}

export type FlattenedItem =
  | { type: 'header'; group: string; itemCount: number }
  | { type: 'item'; data: LinkItem }
