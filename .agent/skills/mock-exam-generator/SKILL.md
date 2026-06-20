---
name: Mock Exam Generator
description: This skill MUST be triggered when the user asks to "generate a mock exam", "create test paper", "give me some practice questions", "模擬考", "出考題", or "幫我出題". Upon triggering, you MUST first use view_file to read this SKILL.md. Unless specified otherwise, default to a comprehensive mock exam. You MUST ALWAYS generate both the Exam (.md) AND the Answer Key (.md) together, or explicitly state you are generating the answer key right after.
version: 0.1.0
---

# Mock Exam Generator (模擬考卷產生器)

This skill enables the AI agent to generate high-quality, customized mock exam papers and detailed solutions based on past exams (考古題), specific subjects, or user weaknesses.

## 核心守則 (Core Rules)

1. **考卷格式遵從與內部排版架構 (Format Consistency & Layout)**
   - **產出的考卷與解答檔案格式一律限定為 `.md` (Markdown) 檔案。**
   - **考卷檔 (`Mock_Exam_X.md`) 結構要求**：開頭必須有 `測驗說明區`（標示測驗時間、總分、範圍），接著才是 H2 層級的題型分類（如：`## 一、選擇題`）。
   - **解答檔 (`Answers_X.md`) 結構要求**：開頭必須提供 `考點分佈總表` 或預期能力分析，讓使用者一目了然這份考卷的重點。
   - 優先分析並採用使用者提供的「考古題」格式。如果發現有更佳的排版建議，必須先詢問使用者。

2. **檔案結構與整理 (File Organization)**
   - 所有生成的模擬考卷與詳解，必須統一儲存於專案或當前目錄新增的 `Exam_paper` 資料夾中。
   - 在 `Exam_paper` 內，必須依照「科目 (Subject)」或「題型 (Question Type)」建立子資料夾，讓使用者能輕鬆找到需要的內容。
   - 命名範例：`Exam_paper/2026_Math_Calculus/Mock_Exam_A.md`, `Exam_paper/English_Grammar/Answers.md`。

3. **出題策略預設與同步產生解答 (Default Behavior & Sync Generation)**
   - **自動預設模式 (Default Behavior)**：當使用者要求生考卷，卻沒有特別聲明要「針對弱點卷」時，AI **不需反問**，必須直接預設採用「A. 擬真考古題 (模擬大考卷)」的策略，直接產出一份符合大考標準的綜合考卷。
   - **解答卷必須同步產生**：在產生考卷的當下，或者緊接著的下一個動作，AI **必須**將解答卷 (`Answers_X.md`) 也一併產生出來，絕對不能讓使用者等待或需要再次提醒。
   - 提供給使用者的出題策略選項（若使用者有特別指定才切換）：
     - **A. 擬真考古題 (Simulated Past Paper):** 完全仿造歷屆試題難易度。
     - **B. 弱點打擊 (Weakness Targeted):** 針對使用者不熟悉或易錯觀念加強。
     - **C. 難度漸進式 (Progressive Difficulty):** 極易到極難，建立信心並測試極限。
     - **D. 觀念大混編 (Topic Mashup):** 跨章節綜合型題目。
     - **E. 限時速寫卷 (Time-Attack Sprint):** 題數少需快直覺反應，適合考前衝刺。

4. **詳解撰寫與呈現規範 (Solution Explanations & Formatting)**
   - 必須提供對應的獨立詳解檔案。不同科目的詳解撰寫重點如下：
     - **理工/數學類 (Math/Physics/Engineering):**
       - 必須條列出「解題步驟 (Step-by-step)」。
       - 標註使用的「核心公式或定理」。
       - 點出「常見錯誤陷阱 (Common pitfalls)」。
     - **程式碼/資訊類 (Programming/Computer Science):**
       - 提供有清楚註解的範例程式碼。
       - 必須包含「時間/空間複雜度 (Time/Space Complexity)」分析。
       - 考量「邊界條件 (Edge cases)」與各種測資。
     - **語言/文科類 (Languages/Humanities):**
       - 列出關鍵單字/文法結構解析。
       - 提供完整翻譯與文化/語境補充。
       - 比較易混淆的相似詞彙或觀念。

5. **嚴格防範幻覺與準確度 (Anti-Hallucination & Accuracy)**
   - 題目中的數據、史實、專有名詞或科學常數必須絕對正確。
   - 數理科的計算題，AI 必須在內部(或草稿中)先行計算驗證，確保題目「有解」且「答案唯一(除非題型為多解)」。

6. **評分標準與鑑別度標籤 (Rubrics & Difficulty Tags)**
   - 在解答卷的結尾，提供一份簡要的「配分建議與評分標準 (Marking Scheme)」。
   - 為每道題目隱藏或標註難度標籤（如：[Easy], [Medium], [Hard]），幫助使用者在訂正時評估自身實力落點。

7. **參考資料與出題依據 (Reference Mechanism)**
   - 如果使用者沒有提供具體的參考資料（如講義、課本內容、過去考題等），AI 必須自動建立一個 `Reference` 目錄來統整相關知識點。
   - **分類存放機制**：`Reference` 資料夾內部的檔案（如考古題、講義），也必須比照 `Exam_paper` 的作法，依照「科目」或「題型」分類建立子資料夾（例如：`Reference/Math_Calculus/`）。
   - **OCR 快取機制**：如果使用者提供的參考資料需要進行 OCR 辨識（如圖片或掃描檔），AI 第一次讀完後，必須將辨識出來的純文字內容存成檔案，並放在該科目的 `Reference` 或考古題子資料夾內。日後出題優先讀取此文字檔，以免每次都要重新 OCR。**重要：OCR之後的檔案內容必須保留所有的考卷題目與原始格式，完整寫在 md 檔案裡面，否則 AI 會看不出來出題的方式。**
   - **在開始產生考卷之前，AI 必須先讀取並分析 `Reference` 內的資料**，確保出題的難易度、用詞、範圍與知識點完全符合參考資料的內容。

8. **考後檢討互動機制 (Post-Exam Review Interaction)**
   - 當使用者寫完考卷並核對完解答後，AI **必須主動詢問**使用者：「你錯了哪幾題？具體遇到了什麼問題或卡在哪個觀念？」
   - 根據使用者的回答，AI 應提供針對性的觀念釐清，並將其記錄為使用者的弱點，作為下次出題（弱點打擊模式）的依據。

9. **學習狀態與弱點追蹤機制 (Learning Status & Weakness Tracking)**
   - AI 必須在各科目維護一份 `Learning_Status.md`。
   - **資料結構模板規範**：必須嚴格遵守以下 Markdown 表格範本，確保格式統一不變形：
     ```markdown
     # [科目名稱] 學習狀態追蹤 (Learning Status)
     | 章節 (Chapter) | 精熟度 | 上次測驗日期 | 易錯盲點紀錄 (Weaknesses & Pitfalls) |
     | :--- | :---: | :--- | :--- |
     | Ch X. 章節名稱 | 🔴/🟡/🟢 | YYYY-MM-DD | 具體的錯誤觀念或弱點描述 |
     ```
   - **出題前**：先讀取 `Learning_Status.md` 了解學習狀態，針對 🔴 (弱點) 或 🟡 (尚可) 強化出題，避開重複考點。
   - **測驗後**：依據作答與檢討結果，自動以上述表格格式覆寫更新 `Learning_Status.md`。

10. **痛點精準紀錄與考前速記轉化 (Pain Point Recording & Cheat Sheet Generation)**
    - 當使用者回報錯題時，AI 必須深挖使用者的「根本錯誤原因（如：觀念混淆、公式背錯）」，詳細記錄在狀態表或總整理儀表板中。
    - **自動轉化素材**：在紀錄痛點的同時，AI 應主動將該弱點轉化為「考前速記素材 (Cheat Sheet)」，例如：比較表格、架構圖/流程圖 (Mermaid) 或一秒記憶口訣。
    - 所有的總整理與速記素材，應集中存放於專案根目錄下的 `Review_Dashboard/` (或相關統整資料夾) 中，方便考前快速複習。
