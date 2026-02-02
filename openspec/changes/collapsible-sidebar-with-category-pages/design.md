# Design: Collapsible Sidebar with Category Pages

## Architecture Overview

### Component Hierarchy
```
App (BrowserRouter)
├── Routes
│   ├── Route "/" → Layout
│   │   ├── Sidebar
│   │   ├── ControlBar
│   │   └── HomePage
│   ├── Route "/category/:slug" → Layout
│   │   ├── Sidebar
│   │   ├── ControlBar
│   │   └── CategoryPage
│   └── Route "*" → NotFoundPage
```

### State Management

#### Global State (NaviProvider)
```typescript
interface NaviState {
  searchQuery: string
  selectedTags: Set<string>
  viewMode: 'card' | 'list'
  collapsedGroups: Set<string>
  sidebarCollapsed: boolean  // NEW
}
```

#### Local State
- `Sidebar`: `isMobileOpen: boolean` (mobile drawer state)
- `CategoryPage`: `currentSlug: string` (from URL params)

### Data Flow

#### Category Filtering
```
useParams() → slug
  ↓
useLinks() → all groups
  ↓
useMemo(() => groups.find(g => g.slug === slug))
  ↓
filterItems(items, { group: currentCategory })
  ↓
ContentArea
```

#### Search Scoping
```
CategoryPage:
  items = allItems.filter(i => i.group === currentCategory)
  searchResults = fuzzySearch(items, query)  // scoped

HomePage:
  items = allItems
  searchResults = fuzzySearch(items, query)  // global
```

## Component Specifications

### Sidebar Component

#### Props
```typescript
interface SidebarProps {
  groups: LinkGroup[]
  currentSlug?: string
  isCollapsed: boolean
  onToggleCollapse: () => void
}
```

#### Responsive Behavior
```typescript
// Desktop (>= 768px)
<aside className={cn(
  "fixed left-0 top-0 h-screen bg-background border-r",
  "transition-all duration-300 ease-in-out",
  isCollapsed ? "w-12" : "w-60"
)}>

// Mobile (< 768px)
<>
  {isMobileOpen && (
    <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
  )}
  <aside className={cn(
    "fixed left-0 top-0 h-screen w-60 bg-background border-r z-50",
    "transition-transform duration-300 ease-in-out md:hidden",
    isMobileOpen ? "translate-x-0" : "-translate-x-full"
  )}>
</>
```

#### Navigation Items
```typescript
groups.map(group => (
  <Link
    to={`/category/${group.slug}`}
    className={cn(
      "flex items-center gap-3 px-4 py-2",
      "hover:bg-accent transition-colors",
      currentSlug === group.slug && "bg-accent font-medium"
    )}
  >
    <Icon name={group.icon} />
    {!isCollapsed && <span>{group.name}</span>}
  </Link>
))
```

### Layout Component

#### Structure
```typescript
function Layout() {
  const { sidebarCollapsed, toggleSidebar } = useNaviStore()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { slug } = useParams()
  const { data: groups } = useLinks()

  return (
    <div className="flex h-screen">
      <Sidebar
        groups={groups}
        currentSlug={slug}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        "md:ml-12 md:ml-60",  // Adjust based on sidebar state
        sidebarCollapsed ? "md:ml-12" : "md:ml-60"
      )}>
        <ControlBar onMenuClick={() => setIsMobileOpen(true)} />
        <Outlet />
      </main>
    </div>
  )
}
```

### CategoryPage Component

#### Implementation
```typescript
function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: groups, items: allItems } = useLinks()
  const { searchQuery, selectedTags, viewMode, collapsedGroups } = useNaviStore()

  const currentGroup = useMemo(
    () => groups.find(g => g.slug === slug),
    [groups, slug]
  )

  const categoryItems = useMemo(
    () => allItems.filter(item => item.group === currentGroup?.name),
    [allItems, currentGroup]
  )

  const searchResults = useFuzzySearch(categoryItems, searchQuery)

  const filteredItems = useMemo(
    () => filterItems({
      items: categoryItems,
      searchQuery,
      selectedTags,
      collapsedGroups,
      searchResults,
    }),
    [categoryItems, searchQuery, selectedTags, collapsedGroups, searchResults]
  )

  if (!currentGroup) {
    return <Navigate to="/404" replace />
  }

  return (
    <ContentArea
      items={filteredItems}
      viewMode={viewMode}
      // ... other props
    />
  )
}
```

## Data Migration

### links.json Update
```json
{
  "groups": [
    {
      "name": "開發工具",
      "slug": "dev-tools",
      "items": [...]
    },
    {
      "name": "學習資源",
      "slug": "learning",
      "items": [...]
    },
    {
      "name": "框架函式庫",
      "slug": "frameworks",
      "items": [...]
    },
    {
      "name": "雲端服務",
      "slug": "cloud",
      "items": [...]
    }
  ]
}
```

## Routing Configuration

### App.tsx
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <NaviProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="category/:slug" element={<CategoryPage />} />
          </Route>
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </NaviProvider>
    </BrowserRouter>
  )
}
```

## Animation Specifications

### Sidebar Transitions
```css
/* Tailwind classes */
transition-all duration-300 ease-in-out

/* Equivalent CSS */
transition: all 300ms ease-in-out;
```

### Content Fade (Collapsed State)
```typescript
<span className={cn(
  "transition-opacity duration-200",
  isCollapsed ? "opacity-0 w-0" : "opacity-100"
)}>
  {group.name}
</span>
```

## Icon Mapping

### Category Icons (using lucide-react)
| Category | Icon Component |
|----------|----------------|
| 開發工具 | `Wrench` |
| 學習資源 | `BookOpen` |
| 框架函式庫 | `Package` |
| 雲端服務 | `Cloud` |

### UI Icons
| Action | Icon |
|--------|------|
| Expand Sidebar | `ChevronRight` |
| Collapse Sidebar | `ChevronLeft` |
| Mobile Menu | `Menu` |
| Close Drawer | `X` |

## Error Handling

### Invalid Slug
```typescript
// In CategoryPage
if (!currentGroup) {
  return <Navigate to="/404" replace />
}
```

### NotFoundPage
```typescript
function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-8">找不到此分類</p>
      <Button asChild>
        <Link to="/">返回首頁</Link>
      </Button>
    </div>
  )
}
```

## Performance Considerations

### Memoization Strategy
- `currentGroup`: Memoize group lookup by slug
- `categoryItems`: Memoize filtered items by group
- `filteredItems`: Memoize final filtered results

### Lazy Loading
Not required for initial implementation (small dataset).

## Accessibility

### Keyboard Navigation
- Sidebar toggle: `Space` or `Enter`
- Category links: Standard `Tab` navigation
- Mobile drawer: `Escape` to close

### ARIA Labels
```typescript
<button
  aria-label={isCollapsed ? "展開側邊欄" : "收起側邊欄"}
  aria-expanded={!isCollapsed}
>
```

## Testing Strategy

### Unit Tests
- Sidebar toggle logic
- Category filtering by slug
- Search scoping within category

### Integration Tests
- Route navigation
- Sidebar state persistence
- Mobile drawer behavior

### E2E Tests
- Full user flow: Home → Category → Search → Navigate back
- Invalid URL handling
- Responsive breakpoint transitions
