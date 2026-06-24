# Antigravity AI 專案核心準則 (Project Context)

此檔案為本專案 (`Stuty-space`) 的專屬核心規則。所有 Antigravity 代理 (Agent) 與子代理 (Subagents) 在每次對話或執行任務前，**必須**優先遵守此檔案內的規範。

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
