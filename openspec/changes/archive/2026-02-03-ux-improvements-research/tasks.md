# UX Improvements - Implementation Tasks

## Task Overview

| ID | 任務 | 優先級 | 依賴 | 預估複雜度 |
|----|------|--------|------|-----------|
| T1 | Config 基礎設施 | High | - | Medium |
| T2 | HashRouter 遷移 | High | - | Low |
| T3 | SearchBar ICON 對齊 | Medium | - | Low |
| T4 | Sidebar 動畫優化 | Medium | T1 | Medium |

---

## T1: Config 基礎設施

### T1.1: 建立 Config 型別
**檔案**：`src/types/config.ts`
```typescript
export interface AppConfig {
  title: string
  subtitle?: string
  favicon?: string
}

export const DEFAULT_CONFIG: AppConfig = {
  title: 'MyNavi',
  subtitle: '',
  favicon: '/vite.svg'
}
```

### T1.2: 建立 Config Context
**檔案**：`src/contexts/ConfigContext.tsx`
```typescript
import { createContext, useContext, type ReactNode } from 'react'
import type { AppConfig } from '@/types/config'
import { DEFAULT_CONFIG } from '@/types/config'

const ConfigContext = createContext<AppConfig>(DEFAULT_CONFIG)

export function ConfigProvider({
  value,
  children
}: {
  value: AppConfig
  children: ReactNode
}) {
  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  return useContext(ConfigContext)
}
```

### T1.3: 建立 Config 檔案
**檔案**：`public/config.json`
```json
{
  "title": "MyNavi",
  "subtitle": "我的導航頁"
}
```

### T1.4: 修改 main.tsx
**檔案**：`src/main.tsx`
**變更**：
1. 新增 `loadConfig` 函數
2. 使用 top-level await 載入 config
3. 包裝 `ConfigProvider`
4. 設定 `document.title`

---

## T2: HashRouter 遷移

### T2.1: 修改 App.tsx
**檔案**：`src/App.tsx`
**變更**：
1. 將 `BrowserRouter` 改為 `HashRouter`
2. 移除 `basename` 變數與配置
3. 移除 `import.meta.env.BASE_URL` 相關邏輯

**Before**:
```typescript
import { BrowserRouter } from 'react-router-dom'
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')
<BrowserRouter basename={basename}>
```

**After**:
```typescript
import { HashRouter } from 'react-router-dom'
<HashRouter>
```

---

## T3: SearchBar ICON 對齊

### T3.1: 修改 SearchBar.tsx
**檔案**：`src/components/SearchBar.tsx`
**變更**：為容器 div 添加 `h-9` class

**Before**:
```tsx
<div className="relative flex-1">
```

**After**:
```tsx
<div className="relative flex-1 h-9">
```

---

## T4: Sidebar 動畫優化

### T4.1: 整合 Config
**檔案**：`src/components/Sidebar.tsx`
**變更**：
1. 導入 `useConfig`
2. 將硬編碼的 "MyNavi" 替換為 `config.title`

### T4.2: 優化文字動畫
**檔案**：`src/components/Sidebar.tsx`
**變更**：
1. 將條件渲染 `{!isCollapsed && <span>...}` 改為 CSS 控制
2. 添加 `whitespace-nowrap overflow-hidden transition-all duration-300`
3. 使用 `w-0 opacity-0` / `w-auto opacity-100` 控制可見性

**Before**:
```tsx
{!isCollapsed && <span>{group.name}</span>}
```

**After**:
```tsx
<span className={cn(
  "whitespace-nowrap overflow-hidden transition-all duration-300",
  isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"
)}>
  {group.name}
</span>
```

---

## Verification Checklist

- [x] `pnpm build` 無錯誤
- [x] `pnpm dev` 啟動正常
- [x] 直接訪問 `/#/category/dev-tools` 顯示正確
- [x] 修改 `config.json` 後標題更新
- [x] 搜尋 ICON 垂直置中
- [x] 側邊欄展開/收起動畫平滑
