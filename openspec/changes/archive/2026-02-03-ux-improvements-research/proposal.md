# UX Improvements Research

## Context

使用者報告了四個 UX 問題需要研究與解決：
1. 網頁標題硬編碼，無法自訂
2. 搜尋欄位 ICON 垂直對齊問題
3. 側邊欄切換缺乏動畫
4. 直接訪問分類頁面時 404 錯誤

## Constraint Sets

### Issue 1: 自訂標題配置

**現況分析：**
- `index.html:7` 硬編碼 `<title>my-navi</title>`
- `Sidebar.tsx:107,139` 硬編碼 `MyNavi` 品牌名稱
- 無配置檔案機制

**Hard Constraints:**
- 必須支援靜態部署（GitHub Pages）
- 不能依賴伺服器端渲染
- 配置必須在 build time 或 runtime 可用

**Soft Constraints:**
- 應遵循 Vite 環境變數慣例
- 配置應集中管理

**建議方案：**
1. **方案 A（推薦）**：使用 `public/config.json` 作為 runtime 配置
   - 優點：部署後可修改，無需重新建置
   - 缺點：需要額外 fetch 請求

2. **方案 B**：使用 Vite 環境變數 `.env`
   - 優點：build time 注入，無額外請求
   - 缺點：修改需重新建置

**配置結構建議：**
```json
{
  "title": "MyNavi",
  "subtitle": "我的導航頁",
  "favicon": "/favicon.ico"
}
```

---

### Issue 2: 搜尋欄位 ICON 對齊

**現況分析：**
- `SearchBar.tsx:50` 使用 `absolute left-3 top-1/2 -translate-y-1/2`
- `Input.tsx:13` 設定 `h-9`（36px 高度）
- ICON 使用 `h-4 w-4`（16px）

**問題根因：**
- `top-1/2 -translate-y-1/2` 理論上應該垂直置中
- 可能原因：
  1. Input 的 `py-1` padding 影響視覺中心
  2. 字體 line-height 與 ICON 視覺重心不一致
  3. Lucide ICON 本身的視覺重心偏移

**Hard Constraints:**
- 必須保持 Input 高度一致性
- 不能破壞現有 focus 狀態樣式

**建議修復：**
```tsx
// 微調 ICON 位置，補償視覺偏移
<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-[calc(50%+1px)] text-muted-foreground" />
```

或使用 flexbox 重構：
```tsx
<div className="relative flex items-center">
  <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
  <Input className="pl-9 pr-9" />
</div>
```

---

### Issue 3: 側邊欄切換動畫

**現況分析：**
- `Sidebar.tsx:97` 桌面版已有 `transition-all duration-300 ease-in-out`
- `Sidebar.tsx:134` 行動版已有 `transition-transform duration-300 ease-in-out`
- 動畫已存在，但可能不夠明顯

**觀察：**
- 寬度變化 `w-12` ↔ `w-60` 已有過渡
- 內容（文字）是瞬間顯示/隱藏，無過渡

**Hard Constraints:**
- 動畫時長不應超過 300ms（避免感覺遲鈍）
- 必須支援 `prefers-reduced-motion`

**建議增強：**
1. **內容淡入淡出**：為 `<span>` 文字添加 opacity 過渡
2. **交錯動畫**：導航項目依序淡入
3. **縮放效果**：展開時 ICON 微縮放

```tsx
// 文字淡入淡出
<span className={cn(
  "transition-opacity duration-200",
  isCollapsed ? "opacity-0 w-0" : "opacity-100"
)}>
  {group.name}
</span>
```

---

### Issue 4: 分類頁面 404 錯誤

**現況分析：**
- 使用 `react-router-dom` 的 `BrowserRouter`
- `App.tsx:25` 定義路由 `/category/:slug`
- `vite.config.ts:8` 設定 `base: '/MyNavi/'`
- `public/_redirects` 僅適用於 Netlify，不適用於 GitHub Pages

**問題根因：**
GitHub Pages 是靜態檔案伺服器，當直接訪問 `/MyNavi/category/dev-tools` 時：
1. 伺服器嘗試尋找 `dist/category/dev-tools/index.html`
2. 該檔案不存在，返回 404
3. SPA 的 client-side routing 無法介入

**Hard Constraints:**
- GitHub Pages 不支援伺服器端重定向配置
- 必須使用純靜態解決方案

**解決方案：**

**方案 A（推薦）：404.html fallback**
```html
<!-- public/404.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script>
    // 將路徑存入 sessionStorage，重定向到首頁
    sessionStorage.setItem('redirect', location.pathname + location.search);
    location.replace('/MyNavi/');
  </script>
</head>
</html>
```

在 `App.tsx` 或 `main.tsx` 中處理：
```tsx
const redirect = sessionStorage.getItem('redirect');
if (redirect) {
  sessionStorage.removeItem('redirect');
  window.history.replaceState(null, '', redirect);
}
```

**方案 B：HashRouter**
- 將 `BrowserRouter` 改為 `HashRouter`
- URL 變為 `/#/category/dev-tools`
- 優點：無需額外處理
- 缺點：URL 不美觀，SEO 不友好

---

## Success Criteria

| Issue | 驗證方式 |
|-------|---------|
| 1. 自訂標題 | 修改配置後，頁面標題與側邊欄品牌名稱正確顯示 |
| 2. ICON 對齊 | 視覺檢查 ICON 與輸入框垂直置中 |
| 3. 側邊欄動畫 | 展開/收起時有平滑過渡，無跳動感 |
| 4. 404 修復 | 直接訪問 `/MyNavi/category/dev-tools` 正確顯示分類頁面 |

## Dependencies

- Issue 1 與 Issue 4 獨立，可並行處理
- Issue 2 與 Issue 3 獨立，可並行處理
- 所有 Issue 互不依賴

## Risks

| 風險 | 緩解策略 |
|------|---------|
| 404.html 方案可能有 SEO 影響 | 對於導航頁應用影響有限 |
| 配置檔案 fetch 失敗 | 提供合理的 fallback 預設值 |
| 動畫可能影響效能 | 使用 CSS transform/opacity，避免 layout thrashing |

## User Decisions

1. **標題配置**：✅ 選擇 **Runtime 配置**（`public/config.json`）
2. **404 處理**：✅ 選擇 **HashRouter**

---

## Final Implementation Plan

### Task 1: 自訂標題功能
- 建立 `public/config.json` 配置檔
- 建立 `useConfig` hook 載入配置
- 修改 `Sidebar.tsx` 使用配置的標題
- 修改 `index.html` 或使用 `document.title` 動態設定

### Task 2: 搜尋欄位 ICON 對齊
- 調整 `SearchBar.tsx` 中 ICON 的垂直位置
- 使用 flexbox 或微調 translate 值

### Task 3: 側邊欄動畫優化
- 為文字內容添加 opacity 過渡
- 確保展開/收起時有平滑視覺效果

### Task 4: 路由 404 修復
- 將 `BrowserRouter` 改為 `HashRouter`
- 移除不再需要的 `basename` 配置
- 更新相關路由邏輯
