# Antigravity AI 專案核心準則 (Project Context)

此檔案為本專案 (`Study-space`) 的專屬核心規則。所有 Antigravity 代理 (Agent) 與子代理 (Subagents) 在每次對話或執行任務前，**必須**優先遵守此檔案內的規範。

## 1. 資源運用策略 (Resource Utilization)

- **優先查閱參考資料 (Reference Lookup)**：
  在進行任何解題、分析、或撰寫報告等任務前，**必須優先檢查 `./Reference/`** 目錄下是否有相關的子資料夾或參考文件（例如考古題 PDF、OCR 快取記錄、範例報告等）。
  切勿盲目上網搜尋或直接要求使用者提供可能已經存在於專案內的資料。

## 2. 檔案路徑與跨設備同步 (Path Management)

- **絕對避免寫死「絕對路徑」 (No Absolute Paths)**：
  本專案已透過 GitHub 在多台設備間同步。在所有的程式碼、Shell Script、Skill 設定檔 (`SKILL.md`)、Workflow 或其他文件產生時，**嚴禁**使用或生成絕對路徑（例如 `C:\Users\cupid\...`）。
  所有路徑皆須使用**相對路徑** (例如 `./Reference/`、`./Review_Dashboard/`) 或動態環境變數取得當前工作目錄，以確保在不同電腦或作業系統上皆能無縫執行。

## 3. 測驗與知識管理 (Knowledge Management)

- **維護 Dashboard**：在完成模擬考檢討、錯題分析或除錯後，應主動將重要觀念與詳解分類整理至 `./Review_Dashboard/` 中的對應筆記檔案，幫助使用者累積考前複習資源。

---

## 4. 可用 Skills 與 Workflows 速查表 (Quick Reference)

此區塊供 AI 代理快速判斷應觸發哪個 Skill 或 Workflow，避免讀錯或遺漏。

### 🎯 學習與考試類 (Study & Exam)

| Skill / Workflow | 用途 | 觸發關鍵字 |
| :--- | :--- | :--- |
| **Mock Exam Generator** | 產生模擬考卷 + 解答卷 | `出考題`、`模擬考`、`practice questions` |
| **Question Sweeper** | 按章節逐題掃蕩，測驗所有題型 | `掃題`、`排查章節`、`sweep` |
| **Study Material Generator** | 將 PPT/PDF 轉為結構化教材 + 知識樹 + 練習題 | `生成教材`、`寫教材`、`整理PPT`、`知識樹`、`study material` |
| **/comprehensive-exam-review** (workflow) | 完整出題→檢討→Dashboard 同步流程 | `/comprehensive-exam-review` |
| **/targeted-exam** (workflow) | 依弱點出題→檢討→更新 Learning Status | `/targeted-exam` |

### 🛠️ 開發工具類 (Dev Tools)

| Skill | 用途 | 觸發關鍵字 |
| :--- | :--- | :--- |
| **Lyra Prompt Optimizer** | 優化 AI 提示詞 | `optimize prompt`、`優化提示詞`、`改寫 prompt` |
| **Report Generator** | 將原始資料轉為結構化報告 | `generate a report`、`彙整報告`、`產生報告` |
| **Skill Creator** | 建立、修改、評估 Skill | `create a skill`、`improve skill`、`skill eval` |
| **TDD** | 測試驅動開發 (Red-Green-Refactor) | `TDD`、`red-green-refactor`、`test-first` |
| **Requesting Code Review** | 派遣審查子代理進行程式碼審查 | 完成實作後、合併前 |
| **Webapp Testing** | 使用 Playwright 測試本地 Web App | `test webapp`、`browser test`、`截圖` |

### 🏗️ 架構與效能類 (Architecture & Perf)

| Skill | 用途 | 觸發關鍵字 |
| :--- | :--- | :--- |
| **Improve Codebase Architecture** | 尋找重構與架構深化機會 | `improve architecture`、`refactor`、`重構` |
| **a11y-audit** | WCAG 2.2 無障礙合規性掃描與修復 | `accessibility`、`a11y`、`WCAG` |
| **Vercel React Best Practices** | React/Next.js 效能最佳化指南 | `React performance`、`Next.js optimize` |
| **Vercel Optimize** | Vercel 部署成本與效能優化 | `Vercel bill`、`caching`、`Core Web Vitals` |

### 📹 其他 Workflows

| Workflow | 用途 | 觸發方式 |
| :--- | :--- | :--- |
| **/gen-video-srt-card-des** | 生成影片字幕、設計字卡、影片介紹 | `/gen-video-srt-card-des` |
