# Proposal: Collapsible Sidebar with Category Pages

## Context
MyNavi 是一個連結導航應用，目前為單頁應用，所有連結以分組方式顯示。使用者希望新增可展開收起的側邊欄，並支援分類頁面導航。

## User Decisions (Confirmed)
| Item | Decision |
|------|----------|
| Sidebar Position | Left |
| Category Source | Existing groups from links.json |
| Navigation Behavior | Navigate to independent pages |
| Default State | Remember last state (localStorage) |
| Routing Solution | react-router-dom |
| URL Format | Use slug (requires new field) |
| Homepage Behavior | Show all links |
| Mobile Layout | Drawer overlay mode |
| Search Scope | Within current category |
| Invalid Route | Show error page |
| Collapsed Mode | Show icons only (~48px) |

## Requirements

### R1: Collapsible Sidebar
- Sidebar on left side of screen
- Toggle button to expand/collapse
- Smooth animation transition
- State persisted via localStorage

### R2: Category Navigation
- Display all groups as navigation items
- Each item links to `/category/:slug`
- Visual indicator for active category
- Responsive design (mobile: overlay or hidden)

### R3: Category Pages
- Route: `/category/:slug`
- Display only links belonging to that category
- Maintain existing card/list view toggle
- Maintain existing search and tag filter functionality

### R4: Data Schema Update
- Add `slug` field to each group in links.json
- Slug format: lowercase, hyphen-separated English

### R5: Homepage
- Route: `/`
- Display all links (current behavior)
- No category filter applied

## Technical Constraints
- Must use react-router-dom (BrowserRouter)
- Must integrate with existing NaviProvider state management
- Must use existing useLocalStorage hook for persistence
- Sidebar width: 200-250px expanded, ~48px collapsed (icon only)

## Success Criteria
1. Sidebar toggles smoothly between expanded/collapsed states
2. Sidebar state persists across page reloads
3. Clicking category navigates to `/category/:slug`
4. Category page shows only that category's links
5. Homepage `/` shows all links
6. URLs are bookmarkable and shareable
7. Browser back/forward navigation works correctly

## Status
- [x] Research completed
- [x] Multi-model analysis (Gemini frontend analysis)
- [x] Ambiguity elimination (all user decisions confirmed)
- [x] PBT properties defined (specs.md)
- [x] Implementation plan created (tasks.md)
- [ ] Ready for implementation
