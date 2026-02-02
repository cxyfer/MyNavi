# OPSX Tasks: Frontend UX Refinements

## Task Dependency Graph

```
T1 (ViewToggle) ─────────────────────────────────────┐
                                                     │
T2 (SearchBar focus) ──┬── T3 (ControlBar state) ────┼── T6 (Integration Test)
                       │                             │
                       └── T4 (TagFilter collapse) ──┘
                                                     │
T5 (Light theme CSS) ────────────────────────────────┘
```

---

## T1: ViewToggle Visual Enhancement

**Status**: completed
**Blocks**: T6
**Files**: `src/components/ViewToggle.tsx`

### Implementation Steps

1. 在 `ToggleGroupItem` 加入 `data-[state=off]:opacity-50` className
2. 驗證選中態 `bg-accent` 已生效（來自 toggle.tsx）

### Code Change

```diff
// src/components/ViewToggle.tsx:18-23
-      <ToggleGroupItem value="card" aria-label="卡片模式">
+      <ToggleGroupItem value="card" aria-label="卡片模式" className="data-[state=off]:opacity-50">
         <LayoutGrid className="h-4 w-4" />
       </ToggleGroupItem>
-      <ToggleGroupItem value="list" aria-label="列表模式">
+      <ToggleGroupItem value="list" aria-label="列表模式" className="data-[state=off]:opacity-50">
         <List className="h-4 w-4" />
       </ToggleGroupItem>
```

### Acceptance Criteria

- [ ] 選中項目有 `bg-accent` 背景
- [ ] 未選中項目有 `opacity-50`
- [ ] Light/Dark 兩種主題下皆可辨識
- [ ] 無障礙功能（aria-label, role）保持不變

---

## T2: SearchBar Focus Events

**Status**: completed
**Blocks**: T3
**Files**: `src/components/SearchBar.tsx`

### Implementation Steps

1. 新增 `onFocusChange?: (focused: boolean) => void` prop
2. 在容器 div 加入 `onFocus` 和 `onBlur` 事件
3. `onBlur` 使用 `relatedTarget` 檢查避免內部焦點切換觸發

### Code Change

```diff
// src/components/SearchBar.tsx:6-11
 interface SearchBarProps {
   value: string
   onChange: (value: string) => void
   debounceMs?: number
   placeholder?: string
+  onFocusChange?: (focused: boolean) => void
 }

// src/components/SearchBar.tsx:13-18
 export function SearchBar({
   value,
   onChange,
   debounceMs = 300,
   placeholder = '搜尋連結...',
+  onFocusChange,
 }: SearchBarProps) {

// src/components/SearchBar.tsx:38-40
-    <div className="relative flex-1">
+    <div
+      className="relative flex-1"
+      onFocus={() => onFocusChange?.(true)}
+      onBlur={(e) => {
+        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
+          onFocusChange?.(false)
+        }
+      }}
+    >
```

### Acceptance Criteria

- [ ] Focus input → `onFocusChange(true)` 被呼叫
- [ ] Blur outside container → `onFocusChange(false)` 被呼叫
- [ ] 點擊清除按鈕不觸發 blur（焦點仍在容器內）

---

## T3: ControlBar State Management

**Status**: completed
**Blocked By**: T2
**Blocks**: T4, T6
**Files**: `src/components/ControlBar.tsx`

### Implementation Steps

1. 新增 `isTagExpanded` state（預設 false）
2. 新增 `collapseTimerRef` useRef
3. 實作 `handleSearchFocusChange` callback
4. 傳遞 `onFocusChange` 給 SearchBar
5. 傳遞 `isExpanded` 給 TagFilter
6. Cleanup timer on unmount

### Code Change

```diff
// src/components/ControlBar.tsx:1
+import { useState, useRef, useEffect, useCallback } from 'react'

// src/components/ControlBar.tsx:19 (inside component, before return)
+  const [isTagExpanded, setIsTagExpanded] = useState(false)
+  const collapseTimerRef = useRef<number | null>(null)
+
+  const handleSearchFocusChange = useCallback((focused: boolean) => {
+    if (focused) {
+      if (collapseTimerRef.current) {
+        clearTimeout(collapseTimerRef.current)
+        collapseTimerRef.current = null
+      }
+      setIsTagExpanded(true)
+    } else {
+      collapseTimerRef.current = window.setTimeout(() => {
+        setIsTagExpanded(false)
+        collapseTimerRef.current = null
+      }, 300)
+    }
+  }, [])
+
+  useEffect(() => {
+    return () => {
+      if (collapseTimerRef.current) {
+        clearTimeout(collapseTimerRef.current)
+      }
+    }
+  }, [])

// src/components/ControlBar.tsx:33
-        <SearchBar value={searchQuery} onChange={onSearchChange} />
+        <SearchBar value={searchQuery} onChange={onSearchChange} onFocusChange={handleSearchFocusChange} />

// src/components/ControlBar.tsx:39
-      <TagFilter tags={tags} selectedTags={selectedTags} onToggle={onToggleTag} />
+      <TagFilter tags={tags} selectedTags={selectedTags} onToggle={onToggleTag} isExpanded={isTagExpanded} />
```

### Acceptance Criteria

- [ ] 初始狀態 `isTagExpanded=false`
- [ ] SearchBar 獲得焦點 → `isTagExpanded=true`
- [ ] SearchBar 失焦 → 300ms 後 `isTagExpanded=false`
- [ ] 300ms 內重新獲得焦點 → 取消收合
- [ ] 組件卸載 → timer 被清除

---

## T4: TagFilter Collapse/Expand UI

**Status**: completed
**Blocked By**: T3
**Blocks**: T6
**Files**: `src/components/TagFilter.tsx`

### Implementation Steps

1. 新增 `isExpanded?: boolean` prop（預設 true 保持向後相容）
2. 分離已選標籤區域（always visible）和未選標籤區域（collapsible）
3. 實作展開/收合動畫
4. 無已選標籤且收合時顯示提示文字
5. 加入 `max-h-48 overflow-y-auto` 處理溢出

### Code Change

```diff
// src/components/TagFilter.tsx:1-5
+import { cn } from '@/lib/utils'
+
 interface TagFilterProps {
   tags: string[]
   selectedTags: Set<string>
   onToggle: (tag: string) => void
+  isExpanded?: boolean
 }

// src/components/TagFilter.tsx:7-8
-export function TagFilter({ tags, selectedTags, onToggle }: TagFilterProps) {
+export function TagFilter({ tags, selectedTags, onToggle, isExpanded = true }: TagFilterProps) {
   if (tags.length === 0) return null

+  const selectedTagList = tags.filter(tag => selectedTags.has(tag))
+  const unselectedTagList = tags.filter(tag => !selectedTags.has(tag))

// Full render logic rewrite - see design.md for complete implementation
```

### Render Structure

```tsx
<div className="space-y-2">
  {/* Selected tags - always visible */}
  {selectedTagList.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {selectedTagList.map(tag => <TagButton key={tag} ... />)}
      {/* Clear button */}
    </div>
  )}

  {/* Hint when collapsed and no selection */}
  {!isExpanded && selectedTags.size === 0 && (
    <p className="text-sm text-muted-foreground">
      點擊搜尋框以瀏覽標籤
    </p>
  )}

  {/* Unselected tags - collapsible */}
  <div className={cn(
    "transition-all duration-300 ease-out overflow-y-auto",
    isExpanded && unselectedTagList.length > 0
      ? "max-h-48 opacity-100"
      : "max-h-0 opacity-0"
  )}>
    <div className="flex flex-wrap gap-2">
      {unselectedTagList.map(tag => <TagButton key={tag} ... />)}
    </div>
  </div>
</div>
```

### Acceptance Criteria

- [ ] 預設 `isExpanded=true` 保持向後相容
- [ ] 收合時已選標籤仍顯示
- [ ] 收合時未選標籤隱藏（max-h-0）
- [ ] 無已選標籤且收合時顯示提示
- [ ] 展開/收合有 300ms 過渡動畫
- [ ] 標籤過多時可捲動（max-h-48）

---

## T5: Light Theme CSS Variables

**Status**: completed
**Blocks**: T6
**Files**: `src/index.css`

### Implementation Steps

1. 將 `:root` 中的 `--cyber-*` 改為 HSL 格式藍色系
2. 在 `.dark` 中定義綠色系 `--cyber-*`
3. 更新 `.cyber-glow` 使用 `hsl()` 函數
4. 驗證 TagFilter 組件在兩種主題下的顯示效果

### Code Change

```diff
// src/index.css:29-37
-  /* Cyberpunk Theme Variables */
-  --cyber-background: #0a0a0f;
-  --cyber-foreground: #e0e0e0;
-  --cyber-accent: #00ff88;
-  --cyber-accent-20: rgba(0, 255, 136, 0.2);
-  --cyber-accent-50: rgba(0, 255, 136, 0.5);
-  --cyber-border: #1a1a2e;
-  --cyber-muted: #16213e;
+  /* Cyberpunk Theme Variables - Light (Blue) */
+  --cyber-background: 210 25% 97%;
+  --cyber-foreground: 222 47% 11%;
+  --cyber-accent: 210 100% 50%;
+  --cyber-accent-20: 210 100% 50% / 0.15;
+  --cyber-accent-50: 210 100% 50% / 0.3;
+  --cyber-border: 214 32% 91%;
+  --cyber-muted: 210 40% 96%;

// src/index.css:59 (add after existing .dark block)
+  /* Cyberpunk Theme Variables - Dark (Green) */
+  --cyber-background: 240 33% 5%;
+  --cyber-foreground: 0 0% 88%;
+  --cyber-accent: 150 100% 50%;
+  --cyber-accent-20: 150 100% 50% / 0.2;
+  --cyber-accent-50: 150 100% 50% / 0.5;
+  --cyber-border: 240 33% 14%;
+  --cyber-muted: 222 47% 16%;

// src/index.css:76-78
 .cyber-glow {
-  box-shadow: 0 0 8px var(--cyber-accent-50), 0 0 16px var(--cyber-accent-20);
+  box-shadow: 0 0 8px hsl(var(--cyber-accent-50)), 0 0 16px hsl(var(--cyber-accent-20));
 }

// src/index.css:80-82
 .cyber-glow-lg {
-  box-shadow: 0 0 12px var(--cyber-accent-50), 0 0 24px var(--cyber-accent-20), 0 0 36px var(--cyber-accent-20);
+  box-shadow: 0 0 12px hsl(var(--cyber-accent-50)), 0 0 24px hsl(var(--cyber-accent-20)), 0 0 36px hsl(var(--cyber-accent-20));
 }
```

### TagFilter CSS Update

```diff
// src/components/TagFilter.tsx - update all var() usages
-  bg-[var(--cyber-accent-20)]
+  bg-[hsl(var(--cyber-accent-20))]

-  text-[var(--cyber-accent)]
+  text-[hsl(var(--cyber-accent))]

// etc. for all --cyber-* usages
```

### Acceptance Criteria

- [ ] Light mode 顯示藍色系 cyber 效果
- [ ] Dark mode 保持綠色系 cyber 效果
- [ ] glow 效果在兩種主題下皆可見
- [ ] 無 CSS 錯誤或警告
- [ ] 對比度符合 WCAG AA

---

## T6: Integration Testing

**Status**: completed
**Blocked By**: T1, T3, T4, T5
**Files**: None (manual/automated testing)

### Test Cases

1. **ViewToggle**
   - [ ] 選中卡片模式 → 卡片按鈕高亮，列表按鈕半透明
   - [ ] 選中列表模式 → 列表按鈕高亮，卡片按鈕半透明
   - [ ] 快速切換不產生視覺閃爍

2. **TagFilter Collapse/Expand**
   - [ ] 初始載入 → 僅顯示已選標籤或提示
   - [ ] 點擊搜尋框 → 展開全部標籤
   - [ ] 在搜尋框內切換焦點（如點擊清除）→ 不收合
   - [ ] 點擊搜尋框外 → 300ms 後收合
   - [ ] 300ms 內重新點擊搜尋框 → 取消收合
   - [ ] 點擊標籤 → 不觸發收合

3. **Light Theme**
   - [ ] Light mode 標籤顯示藍色 glow
   - [ ] Dark mode 標籤保持綠色 glow
   - [ ] 切換主題無視覺錯誤

### Acceptance Criteria

- [ ] 所有測試案例通過
- [ ] 無 console 錯誤
- [ ] Lighthouse Accessibility score ≥ 90

---

## Summary

| Task | Status | Est. Lines | Priority |
|------|--------|------------|----------|
| T1: ViewToggle | completed | +2 | P1 |
| T2: SearchBar focus | completed | +10 | P1 |
| T3: ControlBar state | completed | +25 | P1 |
| T4: TagFilter collapse | completed | +40 | P1 |
| T5: Light theme CSS | completed | +25 | P1 |
| T6: Integration test | completed | 0 | P2 |
