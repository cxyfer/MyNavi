# Navigation Page - Specifications

## Resolved Constraints

### Filtering Logic
| ID | Constraint | Value | Rationale |
|----|------------|-------|-----------|
| C01 | Multi-tag selection | OR (union) | Show items matching ANY selected tag |
| C02 | Search + Tag combination | AND | Must match both search AND tag conditions |
| C03 | Search matching | Fuzzy (fuse.js) | Allow typo tolerance |

### Ordering
| ID | Constraint | Value | Rationale |
|----|------------|-------|-----------|
| C04 | Group ordering | JSON file order | Preserve author intent |
| C05 | Item ordering within group | JSON file order | Preserve author intent |

### Data Loading
| ID | Constraint | Value | Rationale |
|----|------------|-------|-----------|
| C06 | Data source | Runtime fetch from `/public/data/links.json` | Enable hot update without rebuild |
| C07 | Error handling | Error page + retry button | Clear feedback for failures |

### Display Modes
| ID | Constraint | Value | Rationale |
|----|------------|-------|-----------|
| C08 | View modes | Card + List (dual mode with toggle) | User flexibility |
| C09 | Default mode | Card | Visual appeal priority |
| C10 | Mode persistence | localStorage | Remember preference |
| C11 | Card height | Dynamic (measureElement) | Content-adaptive |
| C12 | Mobile view modes | Both modes available | Consistent UX |
| C13 | Grid columns | auto-fill | Responsive to viewport |

### UI Details
| ID | Constraint | Value | Rationale |
|----|------------|-------|-----------|
| C14 | Icon format | URL (image/favicon) | Flexibility |
| C15 | Icon fallback | Text abbreviation (1-2 chars from title) | Graceful degradation |
| C16 | Empty state | Message + "Clear search" button | Clear recovery path |
| C17 | Command Palette scope | Independent search (ignores filters) | Quick global access |

---

## PBT Properties

### 1. Idempotency (冪等性)
| Property | Invariant | Falsification Strategy |
|----------|-----------|----------------------|
| P01 | Repeated toggle of same tag or repeated search query yields identical results | Generate random operation sequence with duplicates; assert state hash equality |

### 2. Commutativity (交換律)
| Property | Invariant | Falsification Strategy |
|----------|-----------|----------------------|
| P02 | Tag selection order does not affect result (A→B = B→A) | Random select 2 tags, apply in both orders; assert result equivalence |
| P03 | Search + Filter order does not affect result | Apply search then filter vs filter then search; assert equivalence |

### 3. Round-trip (往返性)
| Property | Invariant | Falsification Strategy |
|----------|-----------|----------------------|
| P04 | View mode switch preserves filter results | Card→List→Card; assert item IDs and count identical |
| P05 | State serialization to localStorage is lossless | Serialize state → reload → assert state equality |

### 4. Invariant Preservation (不變性維持)
| Property | Invariant | Falsification Strategy |
|----------|-----------|----------------------|
| P06 | Search results satisfy BOTH keyword AND tag conditions | For each result, verify tag match (OR) AND fuzzy keyword match |
| P07 | Result order is stable relative to JSON source order | Map results to original indices; assert strictly increasing within groups |
| P08 | Items without icon display title abbreviation | Render items with empty icon; assert DOM shows substring of title |

### 5. Bounds (邊界條件)
| Property | Invariant | Falsification Strategy |
|----------|-----------|----------------------|
| P09 | Extreme search input does not crash app | Fuzz with special chars, emoji, 10k length; assert no uncaught exception |
| P10 | Command Palette results capped at max limit | 1000 items with same title; assert rendered ≤ MaxLimit (50) |

---

## Updated Requirements

### R5: 搜尋功能 (Updated)
- **Scenario**: 使用者輸入關鍵字搜尋
- **Acceptance**:
  - 搜尋範圍：title + description + tags
  - **搜尋方式：Fuzzy matching (fuse.js)**
  - 即時過濾（debounce 300ms）
  - 高亮匹配文字
  - **與標籤過濾為 AND 關係**

### R6: 標籤系統 (Updated)
- **Scenario**: 使用者點擊標籤過濾
- **Acceptance**:
  - 顯示所有可用標籤
  - 點擊標籤過濾相關連結
  - **多標籤組合過濾：OR（聯集）**

### R7: Command Palette (Updated)
- **Scenario**: 使用者按下 Cmd+K (Mac) / Ctrl+K (Win)
- **Acceptance**:
  - 開啟搜尋面板
  - 支援鍵盤導航（上下鍵、Enter）
  - ESC 關閉面板
  - **獨立搜尋：不受當前標籤/搜尋過濾影響**
  - **結果上限：50 筆**

### R11: 雙視圖模式 (New)
- **Scenario**: 使用者切換 Card / List 顯示模式
- **Acceptance**:
  - 提供 Card / List 切換按鈕
  - Card 模式：auto-fill grid，動態高度
  - List 模式：單欄緊湊列表
  - 記住使用者偏好（localStorage）
  - 預設 Card 模式
  - 行動版保留雙模式切換

### R12: 圖示顯示 (New)
- **Scenario**: 連結項目顯示圖示
- **Acceptance**:
  - icon 欄位為 URL 格式
  - URL 載入失敗時顯示標題前 1-2 字元
  - 使用 loading="lazy" 延遲載入

### R13: 錯誤處理 (New)
- **Scenario**: JSON 載入失敗或格式錯誤
- **Acceptance**:
  - 顯示錯誤頁面
  - 提供重試按鈕
  - Console 輸出詳細錯誤訊息
