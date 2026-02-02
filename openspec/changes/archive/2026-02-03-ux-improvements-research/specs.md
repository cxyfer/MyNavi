# UX Improvements - Specifications

## Requirements

### REQ-1: Runtime Configuration
**描述**：部署者可透過 `public/config.json` 自訂網站標題與副標題

**場景**：
- 當 config.json 存在且有效時，使用配置的標題
- 當 config.json 不存在或載入失敗時，使用預設值 "MyNavi"
- 當 config.json 格式錯誤時，使用預設值並在 console 警告

**約束**：
- 載入策略：阻塞式（main.tsx 中 await）
- Timeout：3 秒
- 路徑：`${import.meta.env.BASE_URL}config.json`

**PBT 屬性**：
- **INVARIANT**: `document.title` 永遠非空
- **FALSIFICATION**: 模擬 fetch 失敗、timeout、JSON parse error

---

### REQ-2: Search Icon Alignment
**描述**：搜尋欄位 ICON 垂直置中對齊

**場景**：
- ICON 視覺中心與 Input 視覺中心對齊
- 不同字體大小下仍保持對齊

**約束**：
- 容器高度固定為 `h-9`（與 Input 一致）
- 使用 `top-1/2 -translate-y-1/2` 定位

**PBT 屬性**：
- **INVARIANT**: ICON 垂直位置 = 容器高度 / 2
- **FALSIFICATION**: 變更 Input 高度，驗證 ICON 仍置中

---

### REQ-3: Sidebar Animation
**描述**：側邊欄展開/收起時有平滑過渡動畫

**場景**：
- 展開時：寬度從 48px → 240px，文字淡入
- 收起時：文字淡出，寬度從 240px → 48px
- 動畫期間無視覺跳動

**約束**：
- 動畫時長：300ms
- 緩動函數：ease-in-out
- 文字保留在 DOM，使用 CSS 控制可見性
- 支援 `prefers-reduced-motion`

**PBT 屬性**：
- **INVARIANT**: 動畫期間 sidebar 寬度在 [48, 240] 範圍內
- **FALSIFICATION**: 快速連續點擊 toggle，驗證無狀態錯亂

---

### REQ-4: HashRouter Migration
**描述**：使用 HashRouter 解決直接訪問子路徑 404 問題

**場景**：
- 直接訪問 `/#/category/dev-tools` 正確顯示分類頁面
- 從首頁導航到分類頁面正常運作
- 瀏覽器重新整理後仍在正確頁面

**約束**：
- 移除 `basename` 配置（HashRouter 不需要）
- URL 格式：`/#/path`

**PBT 屬性**：
- **INVARIANT**: 任何有效路由直接訪問後 `location.hash` 與顯示內容一致
- **FALSIFICATION**: 隨機生成路由路徑，驗證導航正確性

---

## Success Criteria

| ID | 驗證方式 | 自動化 |
|----|---------|--------|
| REQ-1 | 修改 config.json 後重新整理，標題正確顯示 | E2E test |
| REQ-2 | 視覺檢查 + 計算 ICON 位置 | Snapshot test |
| REQ-3 | 展開/收起無跳動，動畫流暢 | Visual regression |
| REQ-4 | 直接訪問 `/#/category/dev-tools` 顯示正確 | E2E test |
