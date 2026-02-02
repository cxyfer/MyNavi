## Why

目前導航頁面的設計風格與預期的 Cyberpunk 賽博龐克美學存在明顯落差。標籤組件缺乏視覺層次感，選中狀態不夠明確，且整體風格未體現出霓虹光暈、故障藝術等核心視覺特徵。需要重新設計以符合設計系統規範，提升視覺識別度與使用者體驗。

## What Changes

- **全局樣式改造**: 將現有標準 Tailwind 主題替換為 Cyberpunk 設計系統，包含霓虹色板（#00ff88 電光綠、#ff00ff 洋紅、#00d4ff 青色）、等寬字體（JetBrains Mono / Orbitron）、掃描線與電路板背景紋理
- **標籤組件重設計**: 將現有 Badge 組件改造為 Hashtag 風格標籤，添加 # 前綴符號
- **選中狀態強化**: 已選擇標籤需具備明確視覺區隔 - 霓虹邊框光暈、背景色填充、發光效果
- **新增動畫效果**: 標籤 hover 與選中時的霓虹脈動、故障閃爍效果
- **切角邊框**: 所有標籤使用 clip-path 實現 45 度切角（chamfered corners）而非圓角

## Capabilities

### New Capabilities
- `cyberpunk-theme`: Cyberpunk 設計系統全域樣式與 CSS 變數定義
- `hashtag-tag`: Hashtag 風格標籤組件，含選中狀態視覺強化

### Modified Capabilities
- 無（此為純前端樣式改造，不涉及現有 spec 行為變更）

## Impact

- **受影響組件**: `TagFilter.tsx`, `LinkCard.tsx`, `index.css`
- **相依變更**: 新增 CSS 變數與工具類，不透過 Tailwind config
- **主題範圍**: Cyberpunk 樣式僅作用於 `.dark` 模式，包含 monospace 字體與掃描線效果
- **潛在風險**:
  - 高對比霓虹色在部分顯示器上可能過於刺眼
  - clip-path 與 box-shadow 衝突需使用偽元素解決
  - 需確保無障礙對比度符合 WCAG AA 標準
