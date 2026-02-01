# Navigation Page - Implementation Tasks

> Zero-decision implementation plan. All decisions have been resolved in specs.md and design.md.

## Phase 1: Project Setup

### T01: Initialize Vite + React + TypeScript
```bash
pnpm create vite . --template react-ts
pnpm install
```
**Verification**: `pnpm dev` starts dev server

### T02: Install Core Dependencies
```bash
pnpm add @tanstack/react-virtual cmdk fuse.js
```
**Verification**: No install errors

### T03: Configure shadcn/ui
```bash
pnpm dlx shadcn-ui@latest init
```
- Style: Default
- Color: Slate
- CSS variables: Yes
- Tailwind config: tailwind.config.js
- Components: src/components/ui
- Utils: src/lib/utils

**Verification**: `pnpm dlx shadcn-ui@latest add button` succeeds

### T04: Add Required shadcn/ui Components
```bash
pnpm dlx shadcn-ui@latest add button input badge toggle-group command
```
**Verification**: Components exist in `src/components/ui/`

---

## Phase 2: Data Layer

### T05: Define TypeScript Types
Create `src/types/link.ts`:
```typescript
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
```

### T06: Create Sample Data
Create `public/data/links.json` with 20+ items across 3+ groups

### T07: Implement useLinks Hook
`src/hooks/useLinks.ts`:
- Fetch from `/data/links.json`
- Return `{ data, loading, error, refetch }`
- Handle fetch errors

**Verification**: Hook returns data in React DevTools

### T08: Implement Data Flattening
`src/lib/flatten.ts`:
- Input: `LinkItem[]`
- Output: `FlattenedItem[]`
- Preserve JSON order

---

## Phase 3: State Management

### T09: Implement useNaviStore
`src/hooks/useNaviStore.ts`:
- Context + useReducer pattern
- State: searchQuery, selectedTags, viewMode, collapsedGroups
- Actions: setSearchQuery, toggleTag, clearFilters, setViewMode, toggleGroup

### T10: Implement useLocalStorage Hook
`src/hooks/useLocalStorage.ts`:
- Type-safe wrapper
- Try-catch for unavailable localStorage
- Default value fallback

### T11: Integrate Persistence
- viewMode → `navi_view_mode`
- collapsedGroups → `navi_collapsed_groups`

---

## Phase 4: Search & Filter

### T12: Implement useFuzzySearch Hook
`src/hooks/useFuzzySearch.ts`:
- Wrap Fuse.js
- Search fields: title, description, tags
- Threshold: 0.4 (default fuzzy)

### T13: Implement Filter Pipeline
`src/lib/filter.ts`:
- Tag filter (OR logic)
- Search filter (AND with tags)
- Return filtered + flattened items

---

## Phase 5: Core Components

### T14: Create SearchBar Component
`src/components/SearchBar.tsx`:
- Input with search icon
- Debounce 300ms
- Clear button when has value

### T15: Create TagFilter Component
`src/components/TagFilter.tsx`:
- Display all unique tags
- Toggle selection (badge style)
- Show selected count

### T16: Create ViewToggle Component
`src/components/ViewToggle.tsx`:
- Card / List toggle buttons
- Use shadcn ToggleGroup
- `role="radiogroup"`

### T17: Create EmptyState Component
`src/components/EmptyState.tsx`:
- Message text
- Clear filters button
- Appropriate icon

### T18: Create ErrorState Component
`src/components/ErrorState.tsx`:
- Error message
- Retry button
- Error details (collapsible)

---

## Phase 6: Item Display

### T19: Create LinkCard Component
`src/components/LinkCard.tsx`:
- Icon (URL or fallback text)
- Title, description, tags
- Click opens URL in new tab
- Search highlight support

### T20: Create LinkRow Component
`src/components/LinkRow.tsx`:
- Compact single-row layout
- Icon, title, truncated description
- Mobile: hide description

### T21: Create GroupHeader Component
`src/components/GroupHeader.tsx`:
- Group name
- Collapse/expand toggle
- Item count badge

### T22: Implement Icon Fallback
In LinkCard/LinkRow:
- `<img>` with onError handler
- Fallback: title substring (1-2 chars)
- loading="lazy"

---

## Phase 7: Virtualization

### T23: Create VirtualList Component
`src/components/VirtualList.tsx`:
- @tanstack/react-virtual
- Dynamic height via measureElement
- Render LinkRow or GroupHeader

### T24: Create VirtualCardGrid Component
`src/components/VirtualCardGrid.tsx`:
- Row-based virtualization
- CSS Grid for columns (auto-fill)
- Group headers span full width
- Reset measurement on resize

### T25: Create ContentArea Component
`src/components/ContentArea.tsx`:
- Switch between VirtualCardGrid and VirtualList
- Reset virtualizer on view mode change
- Handle empty/error states

---

## Phase 8: Command Palette

### T26: Create CommandPalette Component
`src/components/CommandPalette.tsx`:
- Use cmdk
- Cmd+K / Ctrl+K trigger
- Independent search (full dataset)
- Max 50 results
- Keyboard navigation
- ESC to close

---

## Phase 9: Theme & Layout

### T27: Implement Theme System
`src/hooks/useTheme.ts`:
- Dark/light/system modes
- localStorage persistence
- HTML class strategy (dark)

### T28: Create ThemeToggle Component
`src/components/ThemeToggle.tsx`:
- Icon button
- Three states: light, dark, system

### T29: Create App Layout
`src/App.tsx`:
- NavigationContainer wrapper
- Global error boundary
- Theme provider

### T30: Create ControlBar Component
`src/components/ControlBar.tsx`:
- SearchBar + TagFilter + ViewToggle + ThemeToggle
- Responsive layout (stack on mobile)

---

## Phase 10: Integration & Polish

### T31: Wire Up NavigationContainer
`src/components/NavigationContainer.tsx`:
- Compose all components
- Pass props correctly
- Handle loading state

### T32: Add Search Highlight
- Highlight matching text in results
- Use mark tag with styling

### T33: Responsive Breakpoints
- xs: 320px (mobile)
- sm: 640px (small tablet)
- md: 768px (tablet)
- lg: 1024px (desktop)
- xl: 1440px (large desktop)

### T34: Animation Polish
- View mode switch: cross-fade
- Collapse/expand: height transition
- No complex FLIP animations

---

## Phase 11: Deployment

### T35: Configure Vite Build
`vite.config.ts`:
- Base path for GH Pages if needed
- Minification settings

### T36: Create GitHub Actions Workflow
`.github/workflows/deploy.yml`:
- Build on push to main
- Deploy to GH Pages

### T37: Create Cloudflare Pages Config
`public/_redirects`:
```
/*  /index.html  200
```

---

## Phase 12: Testing & Verification

### T38: Manual Functional Testing
- [ ] All R1-R13 requirements
- [ ] PBT properties P01-P10 (manual verification)
- [ ] Cross-browser testing

### T39: Performance Audit
- [ ] Lighthouse Score >= 90
- [ ] FCP < 1.5s
- [ ] TTI < 2s

### T40: Accessibility Audit
- [ ] Keyboard navigation works
- [ ] Screen reader announces changes
- [ ] Focus management correct

---

## Execution Order

```
Phase 1 (T01-T04) → Phase 2 (T05-T08) → Phase 3 (T09-T11)
                                              ↓
Phase 4 (T12-T13) → Phase 5 (T14-T18) → Phase 6 (T19-T22)
                                              ↓
Phase 7 (T23-T25) → Phase 8 (T26) → Phase 9 (T27-T30)
                                              ↓
Phase 10 (T31-T34) → Phase 11 (T35-T37) → Phase 12 (T38-T40)
```

All tasks are mechanical execution. No design decisions required during implementation.
