# Task Commander 2.0

中央大學學業任務指揮中心（Electron + React + Vite + Supabase PWA），串接 `Study-space` 的 `academic_tracker.json`、中央大學 eeclass 自動爬蟲與跨裝置即時雲端同步。

## 主要功能

- **Windows 桌面完整版（Electron）**：
  - 左側導覽欄 + Bento 總覽首頁、讀書專注番茄鐘、自動推算今日／明日課堂與 eeclass 最新事件／公告。
  - 雙軌強警告引擎與系統匣常駐（作業逾期／前 3 天催繳、考前 7 天每日警告、定時讀書督促）。
  - 獨立透明桌面便條、每日任務小工具、AI 成果庫自動監聽與 `Ctrl+K` 快速指令面板。
- **跨設備即時同步（Supabase + Realtime + Storage）**：
  - 整合 `academic_tracker.json` 與所有互動狀態（便條紙、每日任務、生活叮嚀、讀書紀錄、128 學分表），於 Windows 桌機、Laptop（本機或瀏覽器）、iPadOS、iOS 秒級同步。
  - 行動端可線上閱讀 `Study_Materials/`、`Test_Bank/`（自動排除 OCR `.traineddata` 模型）、`Review_Dashboard/` 及輕量 `.md` 心得與詳解（總計 ~26 MB，自動略過 `Reference/` 原始大檔）。
  - 公開唯讀 + 單次解鎖寫入保護：免登入即可瀏覽，首次編輯／上傳時於該裝置輸入本人密碼一次即永久解鎖。
- **iOS / iPadOS 精簡版 PWA**：
  - iPadOS 自動切換窄側欄與雙欄閱讀排版；iOS 切換底部 5 分頁導覽與全螢幕 Markdown / KaTeX / Mermaid / 背誦卡 / PDF 閱讀器。
  - Safari 點「分享 → 加入主畫面」即可全螢幕像原生 App 一樣使用。

## 常用指令

```bash
# 開發預覽
npm run electron:dev

# 日常一鍵更新本機（快速建置 + 覆蓋固定目錄 + 自動維護桌面／開始選單／開機捷徑）
npm run deploy

# 產出標準 Windows NSIS 安裝程式（換機或分享使用）
npm run build:installer

# 預覽待同步上雲的教材與題庫清單（乾跑，不實際上傳）
npm run sync:assets:dry

# 增量同步本機教材與題庫至 Supabase Storage（自動略過 Reference 大檔與未變更檔）
npm run sync:assets

# 程式碼檢查與 Web 建置
npm run lint
npm run build
```

## 雲端同步與線上部署設定（首次設定一次即可）

1. **建立 Supabase 免費專案**：
   - 於 Supabase Dashboard 的 **SQL Editor** 完整貼上並執行 [`supabase/schema.sql`](./supabase/schema.sql)。
   - 前往 **Authentication → Providers → Email**，關閉 `Allow new users to sign up`。
   - 前往 **Authentication → Users → Add user**，建立你本人專用的單一帳號（Email + 自訂密碼）。
2. **設定本機環境變數（Windows 桌機 & Laptop）**：
   - 複製 [`.env.example`](./.env.example) 為 `.env.local`（已加入 `.gitignore`，不會推上 GitHub），填入 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`、`VITE_OWNER_EMAIL` 與 `SUPABASE_OWNER_PASSWORD`。
   - 執行 `npm run sync:assets -- --with-tracker` 將既有資料與教材首度同步上雲。
3. **部署至 Vercel（自動發佈 Web & iOS/iPadOS PWA）**：
   - 在 Vercel 匯入 GitHub Repo `cupid00772/Study-AI`，設定 **Root Directory** 為 `task-commander`。
   - 於 Vercel **Environment Variables** 填入 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`、`VITE_OWNER_EMAIL` 後部署即可。
