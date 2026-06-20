---
description: 完整模擬考與錯題檢討流程，包含自動出題、檢討釐清，並將核心概念同步整理至 Review Dashboard 進行分類
---

# 完整模擬考與檢討總結流程 (Comprehensive Exam & Review Workflow)

這個 Workflow 用於建立一個從「自動出題 ➡️ 錯題檢討 ➡️ 觀念萃取與分類紀錄」的完整閉環，確保每次考試的錯誤都能轉化為考前複習的精華筆記。

## Step 1: 啟動出題 (Mock Exam Generation)
- **必須動作**：首先使用 `view_file` 讀取 `Mock Exam Generator` Skill (`.agent/skills/mock-exam-generator/SKILL.md`) 的指示。
- 根據使用者指定的要求（如科目、難度、範圍），產生對應的模擬考卷 (`Mock_Exam_X.md`) 與解答卷 (`Answers_X.md`)。
- **暫停等待**：產出考卷與解答後，請在此暫停，等待使用者作答完畢並提供需要檢討的題號或疑問。

## Step 2: 錯題檢討與觀念釐清 (Review & Explanation)
- 當使用者回報錯題（例如「第 6 題看不懂」、「第 11 題靠矇的」）時，針對這些題目進行詳細的觀念拆解。
- 解說時必須嚴格遵守全局指令：
  - 客觀理性，不使用過度的讚美與恭維。
  - 將複雜概念結構化輸出（善用標題、清單或比較表格）。

## Step 3: 觀念萃取與 Dashboard 分類同步 (Dashboard Synchronization)
- 檢討完成後，將剛才解說過的核心知識點、易錯陷阱或比較表格進行「精華萃取」。
- 將這些萃取出的概念，寫入並分類到 `c:\Users\Cupid\Downloads\Study-space\Review_Dashboard` 目錄下對應的科目檔案中。
  - **計算機概論**的內容請附加到 `CS_Review.md`。
  - **微積分**的內容請附加到 `Calculus_Review.md`。
  - 若遇到新科目，請依照 `[Subject]_Review.md` 的命名規則在同目錄下建立新檔案。
- 寫入格式：請以對應的考卷名稱作為二級標題（例如 `## Mock Exam X 復盤 (日期)`），並使用三級標題 `### 📌 [觀念名稱]` 將各個考點分開，保持檔案結構的條理清晰。

## Step 4: 結案回報
- 更新 Dashboard 完成後，向使用者客觀地回報已將哪些觀念同步至哪個檔案，完成本次測驗與檢討的閉環。
