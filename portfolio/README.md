# Good Eats Portfolio | 穀意專案技術展示頁

> 一個結合現代化前端體驗、極致視覺設計與 SEO 優化的技術展示頁面。

專案展示網址：[Live Demo](https://goodeats.asia/portfolio/)

## 📖 專案概述 (Overview)

本專案旨在展示 **Good Eats 穀意** 的技術架構與開發歷程。有別於傳統的靜態頁面，我們採用了大量的 **微互動 (Micro-interactions)**、**GPU 加速動畫** 與 **Glassmorphism (毛玻璃)** 設計語言，打造出沉浸式的瀏覽體驗，同時兼顧了 SEO 與網頁效能。

## ✨ 核心特色 (Key Features)

### 🎨 視覺與互動設計
- **斜切雙視窗佈局 (Diagonal Split Layout)**：CSS `skew` 變形與反向補償技術，創造獨特的視覺張力。
- **智能游標系統 (Context-Aware Cursor)**：
  - 預設：放大鏡圖示 🔍
  - 美食區：平底鍋圖示 🍳 + 金色光暈
  - 技術區：筆電圖示 💻 + 青色 Cyberpunk 虛線框
  - 可點擊元素：手指圖示 👆 + 磁吸效果
- **微互動體驗**：
  - **Magnetic Buttons**：按鈕會隨滑鼠輕微吸附移動。
  - **3D Tilt Cards**：卡片隨滑鼠位置產生 3D 傾斜視差效果。
  - **Shimmer Effects**：光影掃過按鈕與卡片的質感特效。
  - **Scroll Reveal**：元素進入視窗時的順滑淡入動畫。

### 🏗️ 系統架構展示 (NEW)
- **Flat-file CMS 機制**：無資料庫架構，讀寫分離設計實現毫秒級載入。
- **CI/CD 自動化流程**：Git Flow + GitHub Actions，從 Dev → Staging → Main → Production 全自動部署。
- **資料保護機制**：雙重資料源降級、防覆蓋機制、衝突偵測與自動備份。

### ⚡ 效能與架構
- **Tailwind CSS 架構**：採用 Utility-first 策略，並透過 `@apply` 封裝核心組件，保持 HTML 整潔。
- **GPU 硬體加速**：關鍵動畫使用 `transform3d` 與 `will-change`，確保 60fps 流暢度。
- **SEO 優化**：完整的 Meta Tags、Open Graph、Twitter Cards 與 JSON-LD 結構化資料。
- **可訪問性 (a11y)**：支援鍵盤導航 (Focus styles)、Skip Link、Reduced Motion 偏好偵測。

## 🛠️ 技術堆疊 (Tech Stack)

| 領域 | 技術選型 |
|------|----------|
| **Core** | HTML5, JavaScript (ES6+), CSS3 |
| **Styling** | **Tailwind CSS v3.4** (JIT Mode) |
| **Animations** | CSS Keyframes, requestAnimationFrame API |
| **Package Manager** | npm |
| **Build Tool** | Tailwind CLI |

## 📂 專案結構

```bash
portfolio/
├── assets/                  # 架構圖片資源
│   ├── Architecture_CICD.png
│   └── Developer_WOrkflow.png
├── dist/
│   └── output.css           # 編譯後的生產環境 CSS (Minified)
├── src/
│   └── input.css            # Tailwind CSS 原始碼與自訂樣式
├── index.html               # 主頁面 (SEO & A11y Optimized)
├── main.js                  # 互動邏輯 (游標、滾動、動畫)
├── styles.css               # 額外的自訂 CSS 特效
├── tailwind.config.js       # Tailwind 設定檔
└── package.json             # 專案依賴與腳本
```

## 🚀 快速開始 (Getting Started)

### 1. 安裝依賴
```bash
npm install
```

### 2. 開發模式 (編譯 CSS 並監聽變更)
```bash
npm run watch:css
```

### 3. 建置生產版本 CSS
```bash
npm run build:css
```

### 4. 啟動本地伺服器
可以使用 `serve` 或 `Live Server`：
```bash
npm run dev
# 或
npx serve -p 3000
```
瀏覽器開啟：`http://localhost:3000`

## 📝 開發日誌

- **v3.0 (Current)**: 新增「System Architecture」區段，整合 Flat-file CMS 與 CI/CD Pipeline 架構圖，優化 UI/UX 間距與視覺層次。
- **v2.5**: 新增放大鏡游標、磁吸按鈕、3D 卡片傾斜等微互動。
- **v2.2**: 優化 SEO 結構，導入 Tailwind CSS 生產編譯流程。
- **v2.0**: 實作斜切佈局與基礎動畫系統。
- **v1.0**: 初始化專案結構。

---
© 2026 Good Eats Team. Crafted with Code & Passion.

