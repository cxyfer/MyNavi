# OPSX Design: Frontend UX Refinements

## Architecture Overview

```
ControlBar (state host)
├── SearchBar (focus events → ControlBar)
│   └── onFocusChange: (focused: boolean) => void
├── TagFilter (visibility controlled by ControlBar)
│   └── isExpanded: boolean (from ControlBar)
│   └── visibleTags: derived from isExpanded + selectedTags
├── ViewToggle (styling only)
│   └── Custom className for cyber variant
└── ThemeToggle (unchanged)
```

---

## R1: ViewToggle Visual Feedback

### Decision: Local Styling Override

**Rationale**: 避免修改 `toggle.tsx` 影響所有 Toggle 組件

**Implementation**:
```tsx
// ViewToggle.tsx - 新增 className 覆蓋
<ToggleGroupItem
  value="card"
  className="data-[state=on]:bg-accent data-[state=off]:opacity-50"
>
```

### CSS Specificity

- `data-[state=on]:bg-accent` 來自 toggle.tsx (已存在)
- 新增 `data-[state=off]:opacity-50` 於 ViewToggle

### No Changes Required

- `toggle.tsx` - 保持原樣
- `toggle-group.tsx` - 保持原樣

---

## R2: TagFilter Collapse/Expand

### State Design

```tsx
// ControlBar.tsx
const [isTagExpanded, setIsTagExpanded] = useState(false)
const collapseTimerRef = useRef<number | null>(null)

const handleSearchFocusChange = useCallback((focused: boolean) => {
  if (focused) {
    // Cancel pending collapse
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current)
      collapseTimerRef.current = null
    }
    setIsTagExpanded(true)
  } else {
    // Delay collapse by 300ms
    collapseTimerRef.current = window.setTimeout(() => {
      setIsTagExpanded(false)
      collapseTimerRef.current = null
    }, 300)
  }
}, [])

// Cleanup on unmount
useEffect(() => {
  return () => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current)
    }
  }
}, [])
```

### Focus Detection Strategy

**Decision**: 使用容器的 `onFocus/onBlur` + `relatedTarget` 檢查

```tsx
// SearchBar.tsx
<div
  className="relative flex-1"
  onFocus={() => onFocusChange?.(true)}
  onBlur={(e) => {
    // Only blur if focus moves outside container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      onFocusChange?.(false)
    }
  }}
>
```

### TagFilter Visibility Logic

```tsx
// TagFilter.tsx
interface TagFilterProps {
  tags: string[]
  selectedTags: Set<string>
  onToggle: (tag: string) => void
  isExpanded?: boolean  // NEW
}

// Derive visible tags
const visibleTags = isExpanded
  ? tags
  : tags.filter(tag => selectedTags.has(tag))
```

### Animation CSS

```tsx
// TagFilter container wrapper
<div className={cn(
  "transition-all duration-300 ease-out overflow-hidden",
  isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
)}>
```

**Issue**: 收合時 selectedTags 也會隱藏

**Solution**: 分離 selectedTags 和 allTags 渲染區域

```tsx
// 已選標籤區域（always visible）
<div className="flex flex-wrap gap-2">
  {tags.filter(t => selectedTags.has(t)).map(...)}
</div>

// 可展開標籤區域
<div className={cn(
  "transition-all duration-300 ease-out overflow-y-auto",
  isExpanded ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"
)}>
  {tags.filter(t => !selectedTags.has(t)).map(...)}
</div>

// 無標籤提示
{!isExpanded && selectedTags.size === 0 && (
  <p className="text-sm text-muted-foreground">
    點擊搜尋框以瀏覽標籤
  </p>
)}
```

---

## R3: Light Theme Blue Cyber

### CSS Variable Architecture

```css
:root {
  /* Light mode cyber (blue) - NEW */
  --cyber-background: 210 25% 97%;   /* #f0f4f8 */
  --cyber-foreground: 222 47% 11%;   /* Slate-900 */
  --cyber-accent: 210 100% 50%;      /* #0066ff */
  --cyber-accent-20: 210 100% 50% / 0.15;
  --cyber-accent-50: 210 100% 50% / 0.3;
  --cyber-border: 214 32% 91%;       /* Slate-200 */
  --cyber-muted: 210 40% 96%;        /* Slate-100 */
}

.dark {
  /* Dark mode cyber (green) - MOVED from :root */
  --cyber-background: 240 33% 5%;    /* #0a0a0f */
  --cyber-foreground: 0 0% 88%;      /* #e0e0e0 */
  --cyber-accent: 150 100% 50%;      /* #00ff88 */
  --cyber-accent-20: 150 100% 50% / 0.2;
  --cyber-accent-50: 150 100% 50% / 0.5;
  --cyber-border: 240 33% 14%;       /* #1a1a2e */
  --cyber-muted: 222 47% 16%;        /* #16213e */
}
```

### HSL Format Conversion

Current (hex/rgba) → New (HSL):

| Variable | Current | Light (HSL) | Dark (HSL) |
|----------|---------|-------------|------------|
| --cyber-background | #0a0a0f | 210 25% 97% | 240 33% 5% |
| --cyber-foreground | #e0e0e0 | 222 47% 11% | 0 0% 88% |
| --cyber-accent | #00ff88 | 210 100% 50% | 150 100% 50% |
| --cyber-accent-20 | rgba(0,255,136,0.2) | 210 100% 50% / 0.15 | 150 100% 50% / 0.2 |
| --cyber-accent-50 | rgba(0,255,136,0.5) | 210 100% 50% / 0.3 | 150 100% 50% / 0.5 |
| --cyber-border | #1a1a2e | 214 32% 91% | 240 33% 14% |
| --cyber-muted | #16213e | 210 40% 96% | 222 47% 16% |

### Usage Pattern Update

Components using `var(--cyber-*)` need to switch to `hsl(var(--cyber-*))`:

```css
/* Before */
background: var(--cyber-accent-20);

/* After */
background: hsl(var(--cyber-accent-20));
```

### Glow Adjustment for Light Mode

```css
.cyber-glow {
  /* Use HSL with alpha for theme-aware glow */
  box-shadow:
    0 0 8px hsl(var(--cyber-accent-50)),
    0 0 16px hsl(var(--cyber-accent-20));
}
```

---

## File Change Summary

| File | Change Type | Lines Est. |
|------|-------------|------------|
| `src/components/ViewToggle.tsx` | Modify | +2 |
| `src/components/ControlBar.tsx` | Modify | +25 |
| `src/components/SearchBar.tsx` | Modify | +8 |
| `src/components/TagFilter.tsx` | Modify | +30 |
| `src/index.css` | Modify | +20, -7 |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Timer race condition | Tag click interrupted | Use focus-within, test with Playwright |
| HSL migration breaks existing styles | Visual regression | Test all components in both themes |
| CLS during expand | Poor UX | Use fixed max-height, no auto |
