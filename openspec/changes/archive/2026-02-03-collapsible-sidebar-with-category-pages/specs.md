# Specifications: Collapsible Sidebar with Category Pages

## Functional Requirements

### FR1: Sidebar Component
| ID | Requirement | Scenario | Expected Behavior |
|----|-------------|----------|-------------------|
| FR1.1 | Sidebar renders on left | Page load | Sidebar visible on left side of viewport |
| FR1.2 | Toggle expand/collapse | Click toggle button | Width transitions 240px ↔ 48px with 300ms ease |
| FR1.3 | State persistence | Reload page | Sidebar state matches localStorage value |
| FR1.4 | Category list display | Expanded state | Show icon + label for each group |
| FR1.5 | Icon-only mode | Collapsed state | Show only icons, hide labels |

### FR2: Routing
| ID | Requirement | Scenario | Expected Behavior |
|----|-------------|----------|-------------------|
| FR2.1 | Homepage route | Navigate to `/` | Display all links from all groups |
| FR2.2 | Category route | Navigate to `/category/:slug` | Display only links from matching group |
| FR2.3 | Invalid slug | Navigate to `/category/invalid` | Show error page with "Back to Home" button |
| FR2.4 | Browser navigation | Click back/forward | Route changes correctly, UI updates |
| FR2.5 | Direct URL access | Enter URL directly | Page loads with correct category filter |

### FR3: Category Page Behavior
| ID | Requirement | Scenario | Expected Behavior |
|----|-------------|----------|-------------------|
| FR3.1 | Filtered display | On category page | Only show links where `group === category.name` |
| FR3.2 | Scoped search | Search on category page | Results filtered within current category only |
| FR3.3 | Tag filter | Apply tag filter | Filter within current category's links |
| FR3.4 | View mode | Toggle card/list | Works same as homepage |
| FR3.5 | Active indicator | On category page | Sidebar highlights current category |

### FR4: Responsive Design
| ID | Requirement | Scenario | Expected Behavior |
|----|-------------|----------|-------------------|
| FR4.1 | Desktop layout | Viewport >= 768px | Sidebar persistent, content shifts |
| FR4.2 | Mobile layout | Viewport < 768px | Sidebar hidden, hamburger menu in header |
| FR4.3 | Mobile drawer | Click hamburger | Sidebar slides in as overlay with backdrop |
| FR4.4 | Auto-close mobile | Select category on mobile | Drawer closes automatically |
| FR4.5 | Backdrop dismiss | Click backdrop | Drawer closes |

## Data Schema

### LinkGroup (Updated)
```typescript
interface LinkGroup {
  name: string      // Display name (e.g., "開發工具")
  slug: string      // URL identifier (e.g., "dev-tools")
  icon?: string     // Optional icon identifier
  items: LinkItem[]
}
```

### Slug Mapping
| Group Name | Slug |
|------------|------|
| 開發工具 | dev-tools |
| 學習資源 | learning |
| 框架函式庫 | frameworks |
| 雲端服務 | cloud |

## Technical Specifications

### Sidebar Dimensions
- Expanded width: 240px
- Collapsed width: 48px
- Transition duration: 300ms
- Transition timing: ease-in-out

### localStorage Keys
- `navi_sidebar_collapsed`: boolean (default: false)
- `navi_view_mode`: 'card' | 'list' (existing)
- `navi_collapsed_groups`: string[] (existing)

### Route Structure
```
/                     -> HomePage (all links)
/category/:slug       -> CategoryPage (filtered links)
/*                    -> NotFoundPage (404)
```

## PBT Properties

### P1: Sidebar State Invariants
| Property | Definition | Falsification |
|----------|------------|---------------|
| P1.1 Idempotency | Double-toggle returns to original state | `toggle(toggle(state)) === state` |
| P1.2 Persistence | State survives reload | Save → Reload → Read === Original |
| P1.3 Bounds | Width is always 48px or 240px | `width ∈ {48, 240}` after transition |

### P2: Routing Invariants
| Property | Definition | Falsification |
|----------|------------|---------------|
| P2.1 Bijection | Each slug maps to exactly one group | `∀ slug: groups.filter(g => g.slug === slug).length === 1` |
| P2.2 Completeness | All groups have valid slugs | `∀ group: /^[a-z0-9-]+$/.test(group.slug)` |
| P2.3 Round-trip | URL → State → URL is identity | `navigate(url) → getUrl() === url` |

### P3: Filter Invariants
| Property | Definition | Falsification |
|----------|------------|---------------|
| P3.1 Subset | Category page items ⊆ all items | `categoryItems.every(i => allItems.includes(i))` |
| P3.2 Partition | Union of all categories = all items | `categories.flatMap(c => c.items) === allItems` |
| P3.3 Scoped search | Search results ⊆ current category | `searchResults.every(i => i.group === currentCategory)` |

### P4: Responsive Invariants
| Property | Definition | Falsification |
|----------|------------|---------------|
| P4.1 Breakpoint | Mobile mode iff width < 768px | `isMobile === (viewport.width < 768)` |
| P4.2 Exclusivity | Desktop sidebar XOR mobile drawer | `!(desktopVisible && mobileOpen)` |
