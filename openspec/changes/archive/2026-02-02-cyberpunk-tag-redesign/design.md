## Context

目前導航頁面使用標準 shadcn/ui 的 Badge 組件呈現標籤，視覺風格為傳統圓角膠囊設計。根據 `openspec/changes/archive/2026-02-02-navigation-page-init/cyberpunk-design.md` 定義的設計系統，需全面轉向賽博龐克美學：深色背景 (#0a0a0f)、霓虹強調色 (#00ff88)、等寬字體、切角邊框、掃描線效果。

現有標籤問題：
1. 選中狀態僅以淺色背景區隔，視覺對比不足
2. 標籤無前綴符號，缺乏科技風格識別
3. 無發光/脈動動畫，靜態呈現過於平淡
4. 整體配色與 Cyberpunk 設計系統不一致

## Goals / Non-Goals

**Goals:**
- 實作 Cyberpunk 設計系統 CSS 變數與工具類
- 改造 TagFilter 組件為 Hashtag 風格（#前綴）
- 強化標籤選中狀態：霓虹邊框光暈 + 背景填充
- 添加 hover/active 動畫效果（發光脈動）
- 確保無障礙對比度符合 WCAG AA 標準

**Non-Goals:**
- 不改變標籤功能邏輯（選中/取消行為維持不變）
- 不修改資料流或狀態管理
- 不引入新的字體 CDN（使用系統等寬字體）
- 不實作複雜的故障藝術動畫（僅保留基礎發光效果）

## Decisions

**1. 使用 CSS 變數而非 Tailwind config 擴展**
- 決定：在 `index.css` 中定義 Cyberpunk 色板為 CSS 變數
- 理由：專案使用 Tailwind v4 `@import "tailwindcss"` 語法，配置方式與傳統不同，直接操作 CSS 變數更直接
- 替代方案：修改 `tailwind.config.ts` - 因版本差異作罷

**2. 標籤選中狀態視覺策略**
- 決定：選中時使用 `box-shadow-neon` 多層發光 + `bg-accent/20` 背景填充
- 理由：單一邊框變化不足以在深色背景上產生明確區隔，發光效果更符合 Cyberpunk 美學
- 替代方案：僅改變文字顏色 - 對比度不足

**3. Hashtag 前綴實作方式**
- 決定：在 TagFilter 組件內使用 `<span>#</span>` 前綴，而非修改 Badge 組件本身
- 理由：保持 Badge 組件通用性，特定風格由父組件控制
- 替代方案：新增 `hashtag` Badge variant - 過度設計

**4. clip-path 切角與發光效果衝突解決方案**
- 決定：採用偽元素方案實作切角 + 發光，主元素使用 clip-path，::before 偽元素創建發光邊框層
- 理由：clip-path 會裁切 box-shadow，必須使用獨立層實作發光效果
- 替代方案：使用 filter: drop-shadow() - 效能較差且與動畫策略衝突

**5. Badge 組件修改範圍**
- 決定：不在 Badge 組件新增 variant，統一在父組件 (TagFilter/LinkCard) 中使用 className 覆蓋樣式
- 理由：避免影響其他使用 Badge 的組件，保持變更範圍可控
- 替代方案：新增 cyberpunk variant - 過度設計且可能造成視覺不一致

**6. 動畫效能策略**
- 決定：僅使用 `transition` 與簡單 `box-shadow` 動畫，避免 `filter: drop-shadow` 與複雜 keyframes
- 理由：導航頁面可能同時顯示數十個標籤，複雜動畫影響滾動效能
- 輔助：實作 `prefers-reduced-motion` 媒體查詢，尊重使用者動畫偏好

## Risks / Trade-offs

**[風險] 高飽和霓虹色造成視覺疲勞**
→ 緩解：使用較低透明度變體（accent/20, accent/40）作為背景，保留高飽和度僅用於邊框與文字

**[風險] 切角邊框 (clip-path) 與 box-shadow 發光衝突**
→ 緩解：採用偽元素方案，::before 創建發光邊框層，主元素維持 clip-path 切角

**[風險] 等寬字體導致標籤寬度不一致，排版凌亂**
→ 緩解：標籤容器使用 `flex-wrap gap-2`，不依賴固定寬度

**[風險] 深色主題與系統淺色模式衝突**
→ 緩解：Cyberpunk 設計僅應用於 `.dark` 模式，確保強制深色背景

**[風險] 動畫對無障礙使用者造成不適**
→ 緩解：實作 `prefers-reduced-motion` media query，禁用 glow 動畫
