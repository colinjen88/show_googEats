# Good Eats Project - Portfolio Update Analysis

以下為針對目前專案程式碼掃描後，補充於原作品集列表之外的新增功能、技術細節與架構調整。

## 1. 新增功能 (Completed Features)

- **角色權限管理 (RBAC)**
  - **使用技術**: PHP Session, Role Hierarchy
  - **說明**: 實作 Admin/Editor/Viewer 三級權限，包含自我保護機制（防止刪除唯一管理員或降級自身權限），採用 Config-based 儲存結構。

- **內容版本控制 (Content Versioning)**
  - **使用技術**: Timestamped JSON Backups, Auto-Rotation
  - **說明**: 編輯儲存時自動備份當前版本，系統自動保留最近 20 份紀錄；實作原子寫入 (Atomic Write) 確保資料完整性。

- **IG 響應式策展 (Adaptive Social Gallery)**
  - **使用技術**: Dynamic Grid Logic
  - **說明**: 元件依據 API 回傳的貼文數量 (2-6 篇)，自動計算最佳化的 Grid Cols 排版，解決不同貼文數量的版面平衡問題。

- **編輯衝突檢測 (Optimistic Locking)**
  - **使用技術**: Content Hash Comparison
  - **說明**: 儲存時比對 baseHash 與伺服器端 currentHash，防止多位管理員同時編輯導致內容覆蓋。

## 2. 技術細節 (Tech Stack Details)

- **效能分級渲染 (Performance Tiering)**
  - **原理**: Hardware Concurrency & Reduced Motion Check
  - **說明**: 自動偵測裝置效能與使用者動態偏好。在低階裝置或開啟減弱動態時，將高耗能的影片背景降級為靜態漸層。

- **上傳安全機制 (Secure File Upload)**
  - **原理**: MIME Type Sniffing & Filename Regeneration
  - **說明**: 透過 `finfo` 驗證真實檔案類型（非僅檢查副檔名），並強制重命名為隨機 ASCII 字串，防止 Shell Upload 或路徑遍歷攻擊。

- **快取控制策略 (Cache Strategy)**
  - **原理**: LiteSpeed Cache Integration
  - **說明**: 內容更新時自動觸發 Server-side Purge (`litespeed_purge_url`)，並配置 `no-cache` Header 確保管理端讀取最新數據。

- **環境隔離保護 (Environment Security)**
  - **原理**: CI/CD Script Injection
  - **說明**: Staging 部署流程自動替換 `robots.txt` 並注入 `noindex` Meta Tag，防止測試站被搜尋引擎索引。

- **優雅降級 (Graceful Degradation)**
  - **原理**: React Error Boundary
  - **說明**: 封裝全域錯誤邊界元件，攔截渲染層級錯誤並顯示友善的 UI 提示，防止單一元件崩潰導致白屏。

## 3. 架構調整 (Refactoring/Adjustments)

- **管理後台延遲載入 (Code Splitting)**
  - **調整**: `React.lazy` & `Suspense`
  - **說明**: 將 AdminEditor 獨立為其餘 Chunk，僅在使用者進入管理模式時載入，降低一般訪客的首屏載入資源 (FCP)。

- **漸進式系統遷移 (Progressive Migration)**
  - **調整**: Backward Compatible Config Parser
  - **說明**: 後端設定檔讀取邏輯保留對舊版單一使用者格式的支援，同時相容新版多角色結構，確保升級過程服務不中斷。

- **資料驅動佈局 (Data-Driven Layout)**
  - **調整**: Dynamic Component Rendering
  - **說明**: 頁面區塊順序與顯示狀態完全由 JSON 設定檔控制 (`sectionOrder`)，前端透過 Map 迴圈動態渲染，無需修改程式碼即可調整版面。
