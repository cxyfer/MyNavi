# UX Improvements - Technical Design

## Architecture Decisions

### AD-1: Config Loading Strategy
**決策**：阻塞式載入（main.tsx 中 await）

**理由**：
- 避免標題/品牌名閃爍
- 配置影響 UI 核心元素
- 3 秒 timeout 足夠處理大多數網路情況

**實作**：
```typescript
// main.tsx
async function loadConfig(): Promise<AppConfig> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 3000)

  try {
    const res = await fetch(`${import.meta.env.BASE_URL}config.json`, {
      signal: controller.signal
    })
    clearTimeout(timeout)
    return await res.json()
  } catch {
    return { title: 'MyNavi', subtitle: '' }
  }
}

const config = await loadConfig()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider value={config}>
      <App />
    </ConfigProvider>
  </StrictMode>
)
```

---

### AD-2: Config Schema
**決策**：使用 JSON 配置檔

**Schema**：
```json
{
  "title": "string (required, default: 'MyNavi')",
  "subtitle": "string (optional, default: '')",
  "favicon": "string (optional, default: '/vite.svg')"
}
```

**檔案位置**：`public/config.json`

---

### AD-3: Sidebar Animation Implementation
**決策**：CSS transition-all + DOM 保留

**實作**：
```tsx
// 文字容器
<span className={cn(
  "whitespace-nowrap overflow-hidden transition-all duration-300",
  isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"
)}>
  {text}
</span>
```

**Reduced Motion 支援**：
```css
@media (prefers-reduced-motion: reduce) {
  .transition-all {
    transition: none;
  }
}
```

---

### AD-4: HashRouter Configuration
**決策**：直接替換 BrowserRouter

**變更**：
```diff
- import { BrowserRouter } from 'react-router-dom'
+ import { HashRouter } from 'react-router-dom'

- const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

- <BrowserRouter basename={basename}>
+ <HashRouter>
```

**URL 格式變更**：
- Before: `/MyNavi/category/dev-tools`
- After: `/MyNavi/#/category/dev-tools`

---

### AD-5: Search Icon Alignment Fix
**決策**：固定容器高度

**變更**：
```diff
- <div className="relative flex-1">
+ <div className="relative flex-1 h-9">
```

---

## File Changes Summary

| 檔案 | 變更類型 | 說明 |
|------|---------|------|
| `public/config.json` | 新增 | Runtime 配置檔 |
| `src/types/config.ts` | 新增 | Config 型別定義 |
| `src/contexts/ConfigContext.tsx` | 新增 | Config Context |
| `src/main.tsx` | 修改 | 阻塞式載入 config |
| `src/App.tsx` | 修改 | HashRouter 替換 |
| `src/components/Sidebar.tsx` | 修改 | 動態標題 + 動畫優化 |
| `src/components/SearchBar.tsx` | 修改 | 容器高度固定 |

---

## Dependencies

```
Task 1 (Config) ─┬─> Task 4 (Sidebar - 需要 config)
                 │
Task 2 (HashRouter) ─> 獨立
                 │
Task 3 (SearchBar) ─> 獨立
```

建議執行順序：
1. Task 2 (HashRouter) - 獨立，可先完成
2. Task 3 (SearchBar) - 獨立，可先完成
3. Task 1 (Config) - 基礎設施
4. Task 4 (Sidebar) - 依賴 Config
