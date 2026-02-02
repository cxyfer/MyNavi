# MyNavi - 極速導航頁面

一個現代化、高效能的個人導航頁面，支援虛擬化列表、模糊搜尋、主題切換與鍵盤快捷操作。

![Build Status](https://github.com/usaya/MyNavi/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)

## 功能特性

| 功能 | 說明 |
|------|------|
| 🔍 **模糊搜尋** | 基於 Fuse.js，支援標題、描述、標籤搜尋 |
| 🏷️ **標籤過濾** | OR 邏輯多標籤篩選 |
| 📐 **雙視圖模式** | Card 網格 / List 列表切換 |
| ⚡ **虛擬化渲染** | @tanstack/react-virtual 處理大量資料 |
| ⌨️ **快捷操作** | `Cmd/Ctrl + K` 開啟 Command Palette |
| 🌓 **主題切換** | Light / Dark / System 三種模式 |
| 📱 **響響式佈局** | 完整支援行動裝置 |
| 💾 **狀態持久化** | localStorage 儲存偏好設定 |

## 技術棧

- **框架**: React 19 + TypeScript 5
- **建置**: Vite 7
- **樣式**: Tailwind CSS 4 + shadcn/ui
- **虛擬化**: @tanstack/react-virtual
- **搜尋**: Fuse.js
- **命令面板**: cmdk

## 快速開始

```bash
# 安裝依賴
pnpm install

# 開發伺服器
pnpm dev

# 生產建置
pnpm build

# 預覽生產版本
pnpm preview
```

## 資料結構

連結資料儲存於 `public/data/links.json`：

```json
{
  "groups": [
    {
      "name": "分類名稱",
      "items": [
        {
          "id": "唯一識別碼",
          "title": "顯示名稱",
          "description": "描述文字",
          "url": "https://example.com",
          "tags": ["標籤1", "標籤2"],
          "group": "分類名稱",
          "icon": "https://example.com/favicon.ico"
        }
      ]
    }
  ]
}
```

## 部署

### GitHub Pages

專案已配置 GitHub Actions 工作流 (`.github/workflows/deploy.yml`)，推送至 `main` 分支即自動部署。

### Cloudflare Pages

上傳 `dist/` 目錄即可，`public/_redirects` 已配置 SPA 路由支援。

## 專案結構

```
src/
├── components/          # React 組件
│   ├── ui/             # shadcn/ui 基礎組件
│   ├── NavigationContainer.tsx
│   ├── ControlBar.tsx
│   ├── VirtualCardGrid.tsx
│   ├── VirtualList.tsx
│   ├── CommandPalette.tsx
│   └── ...
├── hooks/              # 自定義 Hooks
│   ├── useLinks.ts
│   ├── useNaviStore.tsx
│   ├── useFuzzySearch.ts
│   └── useTheme.ts
├── lib/                # 工具函數
│   ├── utils.ts
│   ├── filter.ts
│   └── flatten.ts
├── types/              # TypeScript 型別
│   └── link.ts
└── App.tsx
```

## 快捷鍵

| 快捷鍵 | 功能 |
|--------|------|
| `Cmd/Ctrl + K` | 開啟 Command Palette |
| `Esc` | 關閉 Command Palette |
| `Tab` | 切換焦點 |

## License

MIT
