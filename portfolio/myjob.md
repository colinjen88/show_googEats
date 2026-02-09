# 穀意 Good Eats - 專案作品集展示

> 這是本專案的完整技術文檔與開發歷程展示，旨在呈現系統架構、工程實踐與開發細節。

## 🚀 專案導覽

- **[🌐 線上展示網站 (Live Demo)](https://goodeats.asia)**  
  *點擊前往正式運行的網站，體驗前台視覺與互動效果。*

---

## 📖 網站介紹 (Project Deep Dive)

### 1. 專案概述 (Overview)
「穀意 Good Eats」是一個結合現代化前端體驗與輕量級後端管理的官方形象網站。
本專案不依賴傳統龐大的資料庫系統，而是採用 **Flat-file CMS (檔案式內容管理)** 架構，透過 JSON 檔案進行資料存儲，搭配 PHP API 進行讀寫，實現了極低的維護成本與極高的網頁載入效能。

### 2. 技術堆疊 (Tech Stack)

| 領域 | 技術選型 | 選擇理由 |
|------|----------|----------|
| **Frontend** | **React 18** + **Vite** | 運用 React 生態系的豐富組件與 Vite 的極速構建體驗。 |
| **Styling** | **TailwindCSS** | Utility-first CSS 框架，快速實現響應式與 Glassmorphism 設計。 |
| **Backend** | **PHP 7.4+** | 輕量級 API 接口，負責處理檔案讀寫、圖片上傳與 Session 管理。 |
| **Database** | **JSON** | 無需資料庫伺服器，資料結構簡單，適合中小型形象網站。 |
| **CI/CD** | **GitHub Actions** | 自動化建置與部署 (Build & Deploy)。 |
| **Hosting** | **Hostinger (Apache)** | 高 CP 值虛擬主機，透過 .htaccess 處理 SPA 路由。 |

### 3. 系統架構與機制 (Architecture & Mechanism)

#### 3.1 前後端分離與資料流
- **讀取 (Read)**：前端 React 直接請求靜態的 `content_online.json` 檔案。透過 CDN 或瀏覽器快取機制，實現毫秒級的內容載入。
- **寫入 (Write)**：後台管理介面透過 `fetch` 呼叫 PHP API (`save-content.php`)，API 對 JSON 檔案進行鎖定與寫入，並自動建立備份。

#### 3.2 獨家 Flat-file CMS 機制
為了取代傳統資料庫，我們自行開發了一套檔案管理機制：
- **雙重資料源**：優先讀取線上版 `content_online.json`，若遺失則自動降級讀取本地 `content.json`。
- **防覆蓋機制**：部署程式碼時 (Deploy)，絕對不會覆蓋線上的 `content_online.json` 與 `uploads/` 圖片庫，確保使用者資料安全。
- **衝突偵測**：多人同時編輯時，系統會比對線上檔案雜湊值 (Hash)，若有衝突則提示差異比對 (Diff)，避免資料覆蓋。
- **自動備份**：每次存檔前，系統自動將舊版內容備份至 `/backups/` 目錄，隨時可還原。

### 4. CI/CD 自動化流程 (DevOps)

本專案導入了標準的 Git Flow 開發流程，並配合 GitHub Actions 實現全自動化部署。

```mermaid
graph LR
    Dev[開發者] -->|Push| Develop[Develop 分支]
    Develop -->|Action| Staging[測試站 (staging.goodeats.asia)]
    Staging -->|User Test| PR[Pull Request]
    PR -->|Merge| Main[Main 分支]
    Main -->|Action| Production[正式站 (goodeats.asia)]
```

- **Staging (測試站)**：
  - 由 `develop` 分支觸發。
  - **SEO 防護**：自動注入 `noindex` 標籤與 `robots.txt` 攔截，防止測試內容被 Google 收錄。
  - 對應網址：`staging.goodeats.asia`

- **Production (正式站)**：
  - 由 `main` 分支觸發。
  - 嚴格的部署保護：自動排除 `admin_config.php` (密碼檔) 與 `images/uploads/` (圖片庫)。
  - 對應網址：`goodeats.asia`

### 5. 核心功能特點 (Key Features)

#### ✨ 前台體驗 (Frontend Experience)
- **沉浸式視覺**：全螢幕影片背景與 Canvas 粒子特效 (Floating Particles)。
- **Glassmorphism 設計**：全站採用毛玻璃質感 UI，營造現代高級感。
- **Lottie 動畫**：載入畫面使用 Lottie JSON 動畫，提升質感。
- **極致 SEO**：完整的 Meta Tags、Open Graph 設定、Schema.org 結構化資料。

#### 🛡️ 後台管理 (Admin Dashboard)
- **視覺化編輯**：所見即所得 (WYSIWYG) 的區塊編輯，支援拖曳上傳圖片。
- **安全防護**：
  - CSRF Token 防禦跨站請求偽造。
  - 密碼採用 bcrypt 雜湊儲存。
  - 登入錯誤 5 次自動鎖定 IP。
- **草稿救援**：利用 localStorage 自動除存編輯中的內容，瀏覽器崩潰也不怕。

### 6. 開發歷程記錄 (Development Log)

| 日期 | 版本 | 開發項目 / 里程碑 |
|------|------|-------------------|
| **2026-02-09** | v2.2 | **CI/CD 流程完善**：建立 Branch Protection Rules，優化 Staging/Production 部署腳本。 |
| **2026-02-08** | v2.1 | **自動化部署實作**：完成 GitHub Actions 與 Hostinger FTPS 的串接，實現 Push-to-Deploy。 |
| **2026-02-06** | v2.0 | **Admin UI 優化**：重構後台介面，新增「聯絡資訊」、「經營理念」的可編輯區塊。 |
| **2026-02-04** | v1.8 | **Loading 體驗升級**：導入 Lottie 動畫與 CSS Steam Loading 效果，解決 FOUC 問題。 |
| **2026-02-03** | v1.5 | **視覺大改版**：確立 Dark Theme 與 Glassmorphism 設計語言，實作全螢幕影片背景。 |
| **2026-01-31** | v1.2 | **後台功能增強**：新增「文章回收桶」與「精選文章」功能。 |
| **2026-01-29** | v1.0 | **初期上線**：基礎 CMS 功能完成，React 前端架構定型。 |

---

> *此文件由開發團隊維護，旨在展示專案技術實力與架構思維。*
