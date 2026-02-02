# Implementation Tasks: Collapsible Sidebar with Category Pages

## Phase 1: Dependencies & Data Schema

### T1.1: Install react-router-dom
**Description**: Add routing library to project dependencies.
**Commands**:
```bash
pnpm add react-router-dom
pnpm add -D @types/react-router-dom
```
**Verification**: Check package.json contains react-router-dom

---

### T1.2: Update TypeScript types
**File**: `src/types/link.ts`
**Changes**:
```typescript
export interface LinkGroup {
  name: string
  slug: string      // ADD
  icon?: string     // ADD
  items: LinkItem[]
}
```
**Verification**: TypeScript compiles without errors

---

### T1.3: Update links.json with slugs
**File**: `public/data/links.json`
**Changes**: Add `slug` and `icon` fields to each group:
```json
{
  "groups": [
    {
      "name": "開發工具",
      "slug": "dev-tools",
      "icon": "wrench",
      "items": [...]
    },
    // ... repeat for all groups
  ]
}
```
**Verification**: JSON is valid, all groups have unique slugs

---

## Phase 2: State Management

### T2.1: Extend NaviState
**File**: `src/hooks/useNaviStore.tsx`
**Changes**:
1. Add `sidebarCollapsed: boolean` to `NaviState`
2. Add action types:
   - `TOGGLE_SIDEBAR`
   - `SET_SIDEBAR_COLLAPSED`
3. Add reducer cases
4. Add context methods:
   - `toggleSidebar: () => void`
   - `setSidebarCollapsed: (collapsed: boolean) => void`
5. Update `initialState` to read from localStorage

**Verification**: State updates correctly, persists to localStorage

---

## Phase 3: Core Components

### T3.1: Create Sidebar component
**File**: `src/components/Sidebar.tsx`
**Requirements**:
- Accept props: `groups`, `currentSlug`, `isCollapsed`, `onToggleCollapse`, `isMobileOpen`, `onMobileClose`
- Render category navigation items
- Handle desktop/mobile responsive layouts
- Implement collapse/expand animation
- Show active category indicator

**Verification**:
- Sidebar renders with all categories
- Toggle button works
- Mobile drawer opens/closes
- Active category highlighted

---

### T3.2: Create Layout component
**File**: `src/components/Layout.tsx`
**Requirements**:
- Wrap Sidebar + ControlBar + Outlet
- Manage mobile drawer state
- Adjust main content margin based on sidebar state
- Pass hamburger menu handler to ControlBar

**Verification**: Layout renders correctly on desktop and mobile

---

### T3.3: Update ControlBar for mobile menu
**File**: `src/components/ControlBar.tsx`
**Changes**:
- Add `onMenuClick?: () => void` prop
- Render hamburger button (visible only on mobile)
- Position button appropriately

**Verification**: Hamburger button visible on mobile, triggers drawer

---

### T3.4: Create HomePage component
**File**: `src/pages/HomePage.tsx`
**Requirements**:
- Use existing NavigationContainer logic
- Display all links (no category filter)
- Maintain search/filter functionality

**Verification**: Homepage shows all links, search works globally

---

### T3.5: Create CategoryPage component
**File**: `src/pages/CategoryPage.tsx`
**Requirements**:
- Extract `slug` from URL params
- Find matching group by slug
- Filter items by current category
- Scope search to category items
- Handle invalid slug (redirect to 404)

**Verification**:
- Category page shows only filtered links
- Search scoped to category
- Invalid slug redirects

---

### T3.6: Create NotFoundPage component
**File**: `src/pages/NotFoundPage.tsx`
**Requirements**:
- Display 404 message
- Provide "Back to Home" button

**Verification**: 404 page renders, button navigates home

---

## Phase 4: Routing Integration

### T4.1: Update App.tsx with routing
**File**: `src/App.tsx`
**Changes**:
1. Import BrowserRouter, Routes, Route
2. Wrap app in BrowserRouter
3. Define routes:
   - `/` → Layout → HomePage
   - `/category/:slug` → Layout → CategoryPage
   - `*` → NotFoundPage
4. Keep NaviProvider wrapper

**Verification**: All routes accessible, navigation works

---

### T4.2: Update main.tsx if needed
**File**: `src/main.tsx`
**Check**: Ensure no conflicts with routing setup

**Verification**: App starts without errors

---

## Phase 5: Styling & Polish

### T5.1: Add sidebar animations
**Files**: `src/components/Sidebar.tsx`
**Requirements**:
- Width transition: 300ms ease-in-out
- Content fade on collapse
- Mobile drawer slide animation

**Verification**: Animations smooth, no jank

---

### T5.2: Add responsive breakpoints
**Files**: Multiple components
**Requirements**:
- Use `md:` prefix for >= 768px
- Hide/show elements appropriately
- Test on various screen sizes

**Verification**: Layout adapts correctly at breakpoints

---

### T5.3: Add icon components
**File**: `src/components/Sidebar.tsx`
**Requirements**:
- Import icons from lucide-react
- Map category names to icons
- Render icons in navigation items

**Verification**: Icons display correctly

---

## Phase 6: Testing & Validation

### T6.1: Manual testing checklist
- [ ] Sidebar toggles on desktop
- [ ] Sidebar state persists after reload
- [ ] Mobile drawer opens/closes
- [ ] Category navigation works
- [ ] Search scoped to category
- [ ] Invalid URL shows 404
- [ ] Browser back/forward works
- [ ] All existing features still work

---

### T6.2: Fix any bugs found
**Description**: Address issues discovered during testing

---

## Phase 7: Documentation

### T7.1: Update README if needed
**File**: `README.md`
**Changes**: Document new routing structure and features

---

## Dependency Graph

```
T1.1 → T4.1
T1.2 → T1.3 → T3.1, T3.5
T2.1 → T3.1, T3.2
T3.1 → T3.2
T3.2 → T4.1
T3.3 → T3.2
T3.4 → T4.1
T3.5 → T4.1
T3.6 → T4.1
T4.1 → T5.1
T5.1, T5.2, T5.3 → T6.1
T6.1 → T6.2 → T7.1
```

## Estimated Complexity

| Phase | Complexity | Risk |
|-------|------------|------|
| Phase 1 | Low | Low |
| Phase 2 | Medium | Low |
| Phase 3 | High | Medium |
| Phase 4 | Medium | Medium |
| Phase 5 | Low | Low |
| Phase 6 | Medium | High |
| Phase 7 | Low | Low |

## Critical Path

1. T1.1 (Dependencies)
2. T1.2, T1.3 (Data schema)
3. T2.1 (State management)
4. T3.1, T3.2 (Core components)
5. T3.4, T3.5 (Pages)
6. T4.1 (Routing)
7. T6.1, T6.2 (Testing)

## Notes

- All components should use existing UI primitives from `src/components/ui/`
- Maintain existing code style and patterns
- No breaking changes to existing features
- Ensure TypeScript strict mode compliance
