# OPSX Specs: Frontend UX Refinements

## Requirements Summary

| ID | Requirement | Constraint Count |
|----|-------------|------------------|
| R1 | ViewToggle visual feedback | 5 |
| R2 | TagFilter collapse/expand | 10 |
| R3 | Light theme blue cyber | 9 |

---

## R1: ViewToggle Visual Feedback

### Constraints

| ID | Constraint | Rationale |
|----|------------|-----------|
| C1.1 | 維持 Radix ToggleGroup 結構 | 保留現有無障礙功能 |
| C1.2 | 選中：`bg-accent text-accent-foreground` | 明確視覺區分 |
| C1.3 | 未選中：`opacity-50` | 降低視覺權重 |
| C1.4 | 對比度 ≥ 4.5:1 (WCAG AA) | 無障礙合規 |
| C1.5 | 僅修改 ViewToggle，不影響其他 Toggle 用例 | 避免回歸 |

### PBT Properties

| Property | Invariant | Falsification |
|----------|-----------|---------------|
| P1.1 Single Selection | `∀t: viewMode ∈ {card, list} ∧ exactly one item has state=on` | 快速連續點擊兩個選項 |
| P1.2 State-Style Sync | `state=on ↔ bg-accent applied` | 強制 state=on 但移除 bg-accent class |
| P1.3 Idempotency | 重複選擇同一選項不改變狀態 | 連續點擊同一按鈕 10 次 |

---

## R2: TagFilter Collapse/Expand

### Constraints

| ID | Constraint | Rationale |
|----|------------|-----------|
| C2.1 | 預設收合：僅顯示已選標籤 | 減少視覺噪音 |
| C2.2 | 展開觸發：SearchBar 獲得焦點 | 搜尋意圖顯示全部選項 |
| C2.3 | 收合觸發：SearchBar 失焦後延遲 300ms | 防止誤收合 |
| C2.4 | 動畫：`max-h-0` ↔ `max-h-48`，duration-300，ease-out | 平滑過渡 |
| C2.5 | 溢出處理：`overflow-y-auto` | 標籤過多時可捲動 |
| C2.6 | 收合期間點擊標籤取消收合 | 防止競態中斷 |
| C2.7 | 無已選標籤時顯示提示：「點擊搜尋框以瀏覽標籤」 | 可發現性 |
| C2.8 | 使用 `focus-within` 判斷焦點，非單一 input | 清除按鈕點擊不觸發收合 |
| C2.9 | Timer cleanup on unmount | 防止記憶體洩漏 |
| C2.10 | 不影響現有標籤篩選功能 | 功能完整性 |

### PBT Properties

| Property | Invariant | Falsification |
|----------|-----------|---------------|
| P2.1 Collapse State | `¬isFocused ∧ delay(300) → collapsed` | Blur 後立即 focus 應取消收合 |
| P2.2 Selected Visibility | `collapsed → visibleTags ⊇ selectedTags` | 選中標籤在收合時隱藏 |
| P2.3 Expand Completeness | `expanded → visibleTags = allTags` | 展開時標籤消失 |
| P2.4 Click Interrupt | `收合中 + tag click → cancel collapse` | 點擊標籤但仍收合 |
| P2.5 Timer Cleanup | `unmount → no pending setState` | unmount 後觸發 setState |

---

## R3: Light Theme Blue Cyber Aesthetic

### Constraints

| ID | Constraint | Rationale |
|----|------------|-----------|
| C3.1 | `:root` 定義 light mode `--cyber-*` (藍色系) | 預設為 light |
| C3.2 | `.dark` 覆寫 `--cyber-*` (綠色系) | 保留現有 dark mode |
| C3.3 | 使用 HSL 格式 | 與現有 shadcn 變數一致 |
| C3.4 | `--cyber-accent`: `210 100% 50%` (#0066ff equivalent) | 藍色主色 |
| C3.5 | `--cyber-background`: `210 25% 97%` (#f0f4f8 equivalent) | 微藍灰背景 |
| C3.6 | `--cyber-foreground`: `222 47% 11%` (Slate-900) | 深色文字 |
| C3.7 | glow 效果使用較低透明度 (0.15/0.3) | Light mode glow 需柔和 |
| C3.8 | 不使用純白背景 | 減少刺眼感 |
| C3.9 | chamfer/glow 概念保持一致 | 設計語言統一 |

### PBT Properties

| Property | Invariant | Falsification |
|----------|-----------|---------------|
| P3.1 Theme Isolation | `dark class → green cyber, ¬dark → blue cyber` | 切換主題後變數污染 |
| P3.2 Variable Completeness | `∀component using --cyber-*: defined in both themes` | 刪除一個 dark mode 變數 |
| P3.3 Contrast Ratio | `foreground/background contrast ≥ 4.5` | 降低 foreground 亮度 |

---

## Cross-Cutting Concerns

### Accessibility

- All interactive elements must have `aria-label` or visible label
- Focus indicators must be visible (2px ring minimum)
- Color contrast WCAG AA compliant

### Performance

- No layout shift (CLS) during tag expand/collapse
- Animations respect `prefers-reduced-motion`

### Testing Strategy

- Unit: State transitions, timer behavior
- Visual regression: Toggle states, theme variables
- A11y audit: aXe/Lighthouse
