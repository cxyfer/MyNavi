# OPSX Proposal: Frontend UX Refinements

## Context

用戶對目前前端的三個細節提出改進需求：
1. 檢視模式切換（列表/網格）缺乏視覺反饋
2. 標籤區域佔用過多視覺空間
3. 日間模式視覺效果不佳

## Requirements

### R1: View Mode Toggle Visual Feedback

**Current State:**
- `ViewToggle.tsx` 使用 Radix `ToggleGroup` 組件
- 當前模式僅依賴 `data-[state=on]` 樣式區分
- `toggle.tsx` 定義：`data-[state=on]:bg-accent data-[state=on]:text-accent-foreground`
- 未選中項目與選中項目對比度不足

**Constraint Set:**
- C1.1: 必須保持現有 Radix ToggleGroup 結構
- C1.2: 視覺變化需明確區分選中/未選中狀態
- C1.3: 必須符合 WCAG 對比度標準
- C1.4: 不得破壞現有無障礙功能（aria-label, role）

**Scenarios:**
1. 當用戶切換到列表模式，列表圖標應明顯高亮，網格圖標應降低透明度或淡化
2. 當用戶切換到網格模式，網格圖標應明顯高亮，列表圖標應降低透明度或淡化

### R2: Tag Display Optimization

**Current State:**
- `ControlBar.tsx` 無條件渲染 `TagFilter`（第 39 行）
- `TagFilter.tsx` 顯示所有標籤
- 標籤數量多時會佔用大量視覺空間
- 沒有收合/展開機制

**Constraint Set:**
- C2.1: 預設僅顯示已選擇的標籤
- C2.2: 點擊搜尋框時展開顯示全部標籤
- C2.3: 需要焦點管理邏輯（搜尋框 focus/blur）
- C2.4: 展開/收合需有平滑過渡效果
- C2.5: 不得影響現有的標籤篩選功能

**Scenarios:**
1. 初始狀態：無已選標籤時，標籤區域不顯示或僅顯示提示
2. 有已選標籤：僅顯示已選標籤的 chip
3. 搜尋框獲得焦點：展開顯示全部可選標籤
4. 搜尋框失去焦點：收合至僅顯示已選標籤

### R3: Light Theme Visual Improvement

**Current State:**
- `index.css` 定義兩套主題變數
- Dark mode 有賽博龐克風格（scanline, cyber-glow 等）
- Light mode 使用基礎 HSL 變數，缺乏特色
- Light mode 未定義 cyber 變數系列

**Constraint Set:**
- C3.1: 保持與 Dark mode 相同的視覺語言（chamfer、glow 概念）
- C3.2: Light mode 需重新定義 `--cyber-*` 變數
- C3.3: 不得影響 Dark mode 現有樣式
- C3.4: 色彩需符合日間閱讀舒適度
- C3.5: 避免使用純白背景，考慮微妙的色調

**Scenarios:**
1. Light mode 下卡片、標籤應有與 dark mode 一致的視覺風格
2. Light mode 的 chamfer 效果應可見但不刺眼
3. Light mode 的 glow 效果應柔和但可辨識

## Technical Constraints

### File Scope
- `src/components/ViewToggle.tsx`
- `src/components/ui/toggle.tsx`
- `src/components/TagFilter.tsx`
- `src/components/ControlBar.tsx`
- `src/components/SearchBar.tsx`
- `src/index.css`

### Dependencies
- Radix UI Toggle Group
- Tailwind CSS
- class-variance-authority

## Success Criteria

1. **View Toggle**: 視覺上可在 2 秒內辨識當前模式
2. **Tag Display**: 初始視覺高度減少至少 50%（相比全部展開）
3. **Light Theme**: 用戶可辨識為同一設計語言的淺色版本

## User Decisions (Resolved)

1. **標籤提示**: ✅ 顯示提示 — 收合狀態下顯示「點擊搜尋框以瀏覽標籤」等提示文字
2. **Light mode 色調**: ✅ 藍色系 — 冷色調，符合科技感，與賽博龐克綠色形成對比
3. **收合延遲**: ✅ 延遲 300ms — 失去焦點後短暫延遲，避免意外點擊標籤時收合

## Implementation Notes

### R2 補充約束（基於用戶決策）
- C2.6: 無已選標籤且未展開時，顯示提示文字「點擊搜尋框以瀏覽標籤」
- C2.7: 失去焦點後延遲 300ms 再收合
- C2.8: 點擊標籤區域本身不應觸發收合（僅失去焦點觸發）
- C2.9: ✅ 標籤溢出處理：捲動（max-h-48 overflow-y-auto）

### R3 補充約束（基於用戶決策）
- C3.6: Light mode 採用藍色系主色調
- C3.7: 藍色主色範圍建議：`#0066ff` ~ `#3399ff`（明亮但不刺眼）
- C3.8: 背景使用微藍灰色（如 `#f8fafc`），非純白
- C3.9: ✅ 色彩格式：HSL（與現有 shadcn 變數一致）

### R1 補充約束（基於用戶決策）
- C1.5: ✅ 視覺效果：背景填充（bg-accent）+ 降低未選透明度（opacity-50）

---

## Artifacts Generated

- `specs.md` - Requirements + PBT Properties
- `design.md` - Technical decisions + Architecture
- `tasks.md` - Zero-decision implementation plan
