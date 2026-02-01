# Navigation Page - Initial Setup

## Context

使用者需要一個連結書籤牆（類似 Linktree 但功能更完整），具備：
- 完整的分組功能（可折疊/展開）
- 全文搜尋（標題 + 描述 + 標籤）
- 標籤系統（單層）
- Command Palette 快捷鍵導航
- 深色/淺色主題切換
- 支援 200+ 項目的大型資料集

技術選型：React + Vite + shadcn/ui + Tailwind CSS
部署目標：Cloudflare Pages / GitHub Pages（靜態站點）
資料來源：JSON 靜態檔案

## Constraints (Hard)

| ID | Constraint | Rationale |
|----|------------|-----------|
| H1 | 純靜態站點，無伺服器端邏輯 | 部署至 CF Pages / GH Pages |
| H2 | 所有資料從 JSON 檔案載入 | 無後端 API |
| H3 | 支援虛擬化渲染 | 200+ 項目效能需求 |
| H4 | 產出物為標準 HTML/CSS/JS | 平台相容性 |
| H5 | 響應式設計（Mobile First） | 跨裝置使用 |

## Constraints (Soft)

| ID | Constraint | Rationale |
|----|------------|-----------|
| S1 | 使用 shadcn/ui 元件庫 | 使用者指定 |
| S2 | Tailwind CSS 樣式方案 | shadcn/ui 依賴 |
| S3 | 設計風格參考 designprompts.dev | 使用者指定（後續確認） |
| S4 | 中文介面為主 | 使用者語言偏好 |

## Requirements

### R1: 專案初始化
- **Scenario**: 執行 `pnpm create vite` 初始化 React + TypeScript 專案
- **Acceptance**:
  - `pnpm dev` 可啟動開發伺服器
  - `pnpm build` 可產出靜態檔案至 `dist/`

### R2: shadcn/ui 整合
- **Scenario**: 安裝並配置 shadcn/ui
- **Acceptance**:
  - 可正常 import shadcn/ui 元件
  - Tailwind CSS 正確配置
  - 支援 dark mode class 策略

### R3: 資料結構定義
- **Scenario**: 定義連結項目的 JSON Schema
- **Acceptance**:
  - Schema 包含：id, title, description, url, tags, group, icon (optional)
  - 提供範例資料檔案 `data/links.json`
  - TypeScript 型別定義

### R4: 分組顯示
- **Scenario**: 連結依 group 欄位分組顯示
- **Acceptance**:
  - 每個分組有標題
  - 分組可折疊/展開
  - 記住使用者的折疊狀態（localStorage）

### R5: 搜尋功能
- **Scenario**: 使用者輸入關鍵字搜尋
- **Acceptance**:
  - 搜尋範圍：title + description + tags
  - 即時過濾（debounce 300ms）
  - 高亮匹配文字

### R6: 標籤系統
- **Scenario**: 使用者點擊標籤過濾
- **Acceptance**:
  - 顯示所有可用標籤
  - 點擊標籤過濾相關連結
  - 支援多標籤組合過濾

### R7: Command Palette
- **Scenario**: 使用者按下 Cmd+K (Mac) / Ctrl+K (Win)
- **Acceptance**:
  - 開啟搜尋面板
  - 支援鍵盤導航（上下鍵、Enter）
  - ESC 關閉面板

### R8: 主題切換
- **Scenario**: 使用者切換深色/淺色主題
- **Acceptance**:
  - 提供主題切換按鈕
  - 記住使用者偏好（localStorage）
  - 首次訪問跟隨系統偏好

### R9: 虛擬化渲染
- **Scenario**: 載入 200+ 連結項目
- **Acceptance**:
  - 使用虛擬化技術（如 @tanstack/react-virtual）
  - 頁面載入時間 < 1s
  - 滾動流暢無卡頓

### R10: 靜態部署配置
- **Scenario**: 部署至 Cloudflare Pages / GitHub Pages
- **Acceptance**:
  - 提供 CF Pages 配置（`_redirects` / `wrangler.toml` if needed）
  - 提供 GH Pages 配置（GitHub Actions workflow）
  - SPA 路由支援（404 fallback）

## Success Criteria

1. **功能完整性**
   - [ ] 所有 R1-R10 需求通過驗收
   - [ ] 無 JavaScript console 錯誤

2. **效能指標**
   - [ ] Lighthouse Performance Score >= 90
   - [ ] First Contentful Paint < 1.5s
   - [ ] Time to Interactive < 2s

3. **相容性**
   - [ ] Chrome/Firefox/Safari 最新版正常運作
   - [ ] 響應式斷點：320px / 768px / 1024px / 1440px

4. **部署成功**
   - [ ] Cloudflare Pages 部署成功
   - [ ] GitHub Pages 部署成功
   - [ ] 自訂域名可配置

## Dependencies

```
dependencies:
  - react ^18
  - react-dom ^18
  - @tanstack/react-virtual ^3 (虛擬化)
  - cmdk ^1 (Command Palette)

devDependencies:
  - vite ^5
  - typescript ^5
  - tailwindcss ^3
  - @types/react
  - @types/react-dom
  - shadcn/ui CLI
```

## File Structure (Proposed)

```
MyNavi/
├── public/
│   └── data/
│       └── links.json          # 靜態資料
├── src/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui 元件
│   │   ├── LinkCard.tsx
│   │   ├── LinkGroup.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CommandPalette.tsx
│   │   ├── TagFilter.tsx
│   │   └── ThemeToggle.tsx
│   ├── hooks/
│   │   ├── useLinks.ts         # 資料載入
│   │   ├── useSearch.ts        # 搜尋邏輯
│   │   └── useTheme.ts         # 主題管理
│   ├── types/
│   │   └── link.ts             # TypeScript 型別
│   ├── lib/
│   │   └── utils.ts            # 工具函數
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .github/
│   └── workflows/
│       └── deploy.yml          # GH Pages CI/CD
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| shadcn/ui 學習曲線 | 中 | 參考官方文件，優先使用核心元件 |
| 虛擬化與搜尋整合 | 中 | 先實作基礎功能，再加入虛擬化 |
| 大型資料集 JSON 載入 | 低 | JSON 體積小，可考慮分片載入 |

## Next Steps

1. 執行 `/ccg:spec-plan` 生成詳細實施計劃
2. 確認設計風格（designprompts.dev 樣式選擇）
3. 準備範例資料結構
