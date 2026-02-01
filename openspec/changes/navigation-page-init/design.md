# Navigation Page - Technical Design

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    App.tsx                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │              NavigationContainer                 │   │
│  │  - Data fetching (useLinks)                     │   │
│  │  - Filter state (useNaviStore)                  │   │
│  │  - Error boundary                               │   │
│  │                                                 │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │            ControlBar                    │   │   │
│  │  │  ┌──────────┬──────────┬─────────────┐  │   │   │
│  │  │  │SearchBar │TagFilter │ ViewToggle  │  │   │   │
│  │  │  └──────────┴──────────┴─────────────┘  │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │                                                 │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │           ContentArea                    │   │   │
│  │  │  viewMode === 'card'                    │   │   │
│  │  │    ? <VirtualCardGrid />                │   │   │
│  │  │    : <VirtualList />                    │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │                                                 │   │
│  │  <CommandPalette /> (portal, independent)      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## State Management

### Store Schema (useNaviStore)
```typescript
interface NaviState {
  // Filter state
  searchQuery: string
  selectedTags: Set<string>

  // View state
  viewMode: 'card' | 'list'
  collapsedGroups: Set<string>

  // Derived (computed via useMemo)
  // filteredItems: FlattenedItem[]
}

interface NaviActions {
  setSearchQuery: (query: string) => void
  toggleTag: (tag: string) => void
  clearFilters: () => void
  setViewMode: (mode: 'card' | 'list') => void
  toggleGroup: (groupId: string) => void
}
```

### Persistence Strategy
| State | Storage | Key |
|-------|---------|-----|
| viewMode | localStorage | `navi_view_mode` |
| collapsedGroups | localStorage | `navi_collapsed_groups` |
| theme | localStorage | `navi_theme` (existing) |

## Data Flow

### Filtering Pipeline
```
Raw JSON
    │
    ▼
[Tag Filter: OR]
    │ selectedTags.size === 0 ? all : items.filter(
    │   item => item.tags.some(t => selectedTags.has(t))
    │ )
    │
    ▼
[Search Filter: Fuzzy AND]
    │ searchQuery === '' ? passthrough : fuse.search(query)
    │
    ▼
[Flatten for Virtualization]
    │ [{type:'header', group}, {type:'item', ...}, ...]
    │
    ▼
Filtered & Flattened Items
```

### Data Structure (Flattened)
```typescript
type FlattenedItem =
  | { type: 'header'; group: string; itemCount: number }
  | { type: 'item'; data: LinkItem }
```

## Component Specifications

### VirtualCardGrid
- Virtualizer: `@tanstack/react-virtual` with custom grid adapter
- Row calculation: `rowCount = Math.ceil(visibleItems.length / columns)`
- Column calculation: CSS `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
- Height estimation: Use `measureElement` for dynamic heights
- Group headers span full width

### VirtualList
- Virtualizer: `@tanstack/react-virtual` standard list
- Item height: Estimated 60px, refined via `measureElement`
- Condensed mobile layout: Icon + Title only

### LinkCard / LinkRow
```typescript
interface LinkItemProps {
  item: LinkItem
  searchQuery: string // for highlight
  onTagClick: (tag: string) => void
}
```

### Icon Fallback Logic
```typescript
function getIconFallback(title: string): string {
  // Extract first 1-2 chars, handle emoji/CJK
  const chars = [...title]
  return chars.slice(0, 2).join('')
}
```

## Dependencies (Updated)

```yaml
dependencies:
  react: ^18
  react-dom: ^18
  @tanstack/react-virtual: ^3
  cmdk: ^1
  fuse.js: ^7  # Fuzzy search

devDependencies:
  vite: ^5
  typescript: ^5
  tailwindcss: ^3
  @types/react: latest
  @types/react-dom: latest
```

## File Structure (Updated)

```
src/
├── components/
│   ├── ui/                    # shadcn/ui
│   ├── NavigationContainer.tsx
│   ├── ControlBar.tsx
│   ├── SearchBar.tsx
│   ├── TagFilter.tsx
│   ├── ViewToggle.tsx
│   ├── ContentArea.tsx
│   ├── VirtualCardGrid.tsx
│   ├── VirtualList.tsx
│   ├── LinkCard.tsx
│   ├── LinkRow.tsx
│   ├── GroupHeader.tsx
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   ├── CommandPalette.tsx
│   └── ThemeToggle.tsx
├── hooks/
│   ├── useLinks.ts            # Data fetching + error handling
│   ├── useNaviStore.ts        # Central state (Context + Reducer)
│   ├── useFuzzySearch.ts      # Fuse.js wrapper
│   ├── useLocalStorage.ts     # Type-safe localStorage
│   └── useTheme.ts
├── types/
│   └── link.ts
├── lib/
│   ├── utils.ts
│   ├── flatten.ts             # Data flattening logic
│   └── filter.ts              # Filter pipeline
├── App.tsx
├── main.tsx
└── index.css
```

## Error Handling

### JSON Load Failure
1. Display `<ErrorState />` with message and retry button
2. Console.error with detailed info
3. Retry triggers re-fetch

### Icon Load Failure
1. `<img>` onError → set local state to fallback
2. Display `<span>` with title abbreviation
3. Apply same styling (rounded, colored background)

### localStorage Unavailable
1. Try-catch all localStorage operations
2. Fallback to in-memory defaults
3. Silent degradation (no user notification)

## Accessibility

- ViewToggle: `role="radiogroup"` with `aria-checked`
- Search results: `aria-live="polite"` announcements
- Keyboard: Tab order follows visual order
- Focus management: Focus first result when search yields results
- Command Palette: Focus trap when open

## Performance Considerations

1. **Debounce**: Search input 300ms
2. **useMemo**: Filter pipeline computation
3. **React.memo**: LinkCard, LinkRow prevent re-renders
4. **Lazy loading**: `loading="lazy"` for icons
5. **Virtualizer reset**: Call `virtualizer.measure()` on view mode change
