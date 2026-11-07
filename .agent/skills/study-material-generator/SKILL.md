---
name: Study Material Generator
description: This skill MUST be triggered when the user asks to "generate study materials", "create teaching notes", "make tree diagrams from PPT/PDF", "整理教材", "生成教材", "寫教材", "知識樹", "把PPT變成筆記", "整理課程資料", or "幫我整理PPT". It reads all PPT/PDF files in a given directory, produces a Mermaid Tree Diagram and structured Markdown study material (with practice questions) for each file, then saves everything under Study_Materials/. Trigger this skill even if the user only mentions wanting to organize or summarize lecture slides, course materials, or chapter content into notes.
version: 1.0.0
---

# Study Material Generator (教材產生器)

This skill enables the AI agent to transform raw lecture files (PPT/PPTX/PDF) into structured, exam-ready study materials — each with a visual knowledge tree and practice questions.

## 核心守則 (Core Rules)

1. **輸出格式一律為 `.md` (Markdown)**。所有教材、樹圖、索引皆以 Markdown 呈現。
2. **每份原始檔案產出一份獨立教材**。檔名對應原始章節（如 `Chapter_1_教材.md`）。
3. **所有路徑使用相對路徑**，遵守 `CONTEXT.md` 規範，嚴禁寫死絕對路徑。
4. **雙語策略 (Bilingual Approach)**：
   - 教材**描述與解說以中文為主**。
   - **專業術語、考試常見英文單詞必須保留英文**，格式為「中文（English Term）」或直接使用英文。
   - 目的：學生在讀中文理解概念的同時，自然記住英文術語，兼顧考試與英文能力提升。
   - 範例：「母體平均數（Population Mean）」、「標準差（Standard Deviation, $\sigma$）」、「虛無假設（Null Hypothesis, $H_0$）」。

---

## 完整工作流程 (Workflow)

當使用者觸發此 Skill 時，嚴格依照以下步驟執行：

### Phase 1: 偵測與準備

#### Step 1: 掃描目標目錄

1. 確認使用者指定的目錄路徑。
2. 列出目錄中所有 `.pptx`、`.ppt`、`.pdf` 檔案。
3. 向使用者回報檔案清單，確認是否全部處理或僅選擇部分。
4. 如果目錄為空或不含支援的檔案格式，立即通知使用者並停止。

#### Step 2: 確認科目名稱

1. 嘗試從目錄路徑自動推斷科目名稱（如路徑含 `統計學` 則科目為「統計學」）。
2. 向使用者確認推斷結果是否正確。若無法推斷，詢問使用者。

### Phase 2: 逐檔處理

對每一份檔案，依序執行 Step 3 ~ Step 6：

#### Step 3: 讀取與萃取內容

1. 使用 `view_file` 讀取 PDF/PPT 的內容。
2. 若檔案為圖片型 PDF（掃描檔），使用 OCR 讀取文字，並將 OCR 結果快取為 `.md` 存放於 `./Reference/` 對應子目錄下（遵循 Mock Exam Generator 的 OCR 快取機制）。
3. 辨識並擷取以下結構：
   - 章節主標題
   - 各節 (Section) 標題
   - 知識點 (Key Concepts)
   - 子知識點 (Sub-concepts)
   - 關鍵公式、定理、定義
   - 重要範例或圖表描述

#### Step 4: 建構知識結構 (Knowledge Structure)

1. 將萃取的內容組織為階層式知識結構：

   ```text
   Chapter X
   ├── Section 1
   │   ├── Concept A
   │   │   ├── Sub-concept A1
   │   │   └── Sub-concept A2
   │   └── Concept B
   └── Section 2
       └── Concept C
   ```

2. 確保結構完整覆蓋原始檔案中的所有知識點，不遺漏。

#### Step 5: 產生 Mermaid Tree Diagram (從左到右開展 + 可點擊互動)

1. 將知識結構轉換為 Mermaid `flowchart LR`（由左至右開展之樹狀圖，外觀類似決策樹 / 延伸分支圖）。
2. **所有節點文字一律使用雙引號包覆 `["..."]`**，防止冒號、括號、箭頭或特殊符號引發 Parse Error。
3. **為每個主章節節點加入點擊跳轉事件**：
   - 使用 `click SecX href "#sec-X" "👉 點擊閱讀章節標題"`。
4. **在 Mermaid 樹狀圖下方，必須緊接著附上「學習進度檢核表」**：
   - 提供 Markdown 複選框 `- [ ] [章節名稱](#sec-X)`，讓學生在讀完各節後直接勾選打勾，建立強烈的學習成就反饋感。
5. 格式範例：

   ```mermaid
   flowchart LR
       Root(["Chapter X: 章節標題"])
       
       Root --> Sec1["1. 主知識點 A"]
       Sec1 --> Sub1["子觀念 A1"]
       Sec1 --> Sub2["子觀念 A2"]
       
       Root --> Sec2["2. 主知識點 B"]
       Sec2 --> Sub3["子觀念 B1"]
       
       %% 節點點擊跳轉事件
       click Sec1 href "#sec-1" "👉 點擊前往 1. 主知識點 A"
       click Sec2 href "#sec-2" "👉 點擊前往 2. 主知識點 B"
   ```

   <a id="tree-diagram"></a>

   ### 🎯 本章學習進度檢核 (完成後打勾，建立成就反饋)

   - [ ] [1. 主知識點 A](#sec-1)
   - [ ] [2. 主知識點 B](#sec-2)

#### Step 6: 撰寫知識點教材

對知識結構中的**每一個知識點**，依照以下模板撰寫教材內容：

- **禁止使用 `<details><summary>` 放置答案**（因為在編輯器與多數預覽中會直接透出答案，失去刷題自我檢驗效果）。
- **題目區僅保留題目與選項**，下方放置跳轉連結：`👉 [查看本節練習題答案與詳細解析](#ans-sec-X)`。
- **所有解答與詳細解析統一移至章節末尾的獨立解答專區 (`## 🔑 本章練習題答案與詳細解析 (Answer Key)`)**，並附上跳回題目與返回架構圖的錨點連結。

```markdown
<a id="sec-1"></a>
### 1. [知識點名稱]

#### 📌 核心概念
> 用清晰的語言解釋定義與原理。避免照抄 PPT，應重新組織為易於理解的敘述。

#### 📐 關鍵公式 / 定理
> - 列出公式，使用 LaTeX 語法（`$...$`）
> - 標示各變數的意義與單位
> - 若有多個相關公式，說明使用情境的差異

#### 💡 重要觀念提醒
> - 易混淆的觀念對比（以表格呈現）
> - 常見誤解與正確理解
> - 記憶口訣或直覺性理解方式

#### 📊 範例
> 一道完整示範題，包含題目敘述、逐步解題過程與最終答案。

<a id="q-sec-1"></a>
#### ✏️ 練習題

**Q1.** [題目] `[Medium]`
(A) ...
(B) ...

**Q2.** [題目] `[Medium]`
(A) ...
(B) ...

👉 [查看本節練習題答案與詳細解析](#ans-sec-1)
```

**知識點教材撰寫原則：**

- 核心概念不照抄原文，而是用自己的語言重新組織，確保學生能「讀懂」而非「讀過」。
- 公式必須解釋「為什麼這樣用」，不只是列出。
- 範例題與練習題必須是**新出的題目**，不可直接複製 PPT 中的例題。
- 若某知識點與其他章節相關，加入跨章節關聯提示：

  ```markdown
  > 🔗 **關聯**：Chapter X — [相關知識點名稱]
  ```

### Phase 3: 組裝與輸出

#### Step 7: 組裝完整教材檔案

每份章節教材的完整結構為：

```markdown
# Chapter X: [章節標題]

> 📅 生成日期：YYYY-MM-DD
> 📄 來源檔案：[原始檔案名稱]

---

## 🗺️ 知識架構總覽 (Tree Diagram)

(Mermaid 知識樹)

---

## 📖 知識點教材

(所有知識點的完整教材內容)

---

## 📋 本章重點速記表

| # | 觀念 | 一句話定義 | 核心公式 |
|:--|:-----|:----------|:---------|
| 1 | ...  | ...       | ...      |

---

## 🃏 考前速查卡片

(每個關鍵觀念一張卡片，格式為：)

| 正面 (問題) | 背面 (答案) |
|:-----------|:-----------|
| 什麼是 ...？ | ...的定義是... |

---

## ⚠️ 本章常見考試陷阱

1. **陷阱名稱**：描述 → 正確做法
2. ...

---

## 📊 本章練習題統計

| 難度 | 題數 |
|:-----|:-----|
| Easy | X |
| Medium | X |
| Hard | X |
| **合計** | **X** |
```

#### Step 8: 儲存檔案

1. 建立輸出目錄：`./Study_Materials/<科目名稱>/`
2. 每章教材存為：`Chapter_X_教材.md`
3. 檔名中的 `X` 對應原始檔案的章節編號。

#### Step 9: 產生總覽索引

在 `./Study_Materials/<科目名稱>/` 目錄下產生 `_INDEX.md`：

```markdown
# [科目名稱] — 教材總覽

> 📅 生成日期：YYYY-MM-DD
> 📂 來源目錄：[原始目錄路徑]
> 📄 共處理 X 份檔案

## 目錄

| 章節 | 知識點數 | 練習題數 | 連結 |
|:-----|:--------|:--------|:-----|
| Chapter 1: ... | X | X | [開啟](./Chapter_1_教材.md) |
| Chapter 2: ... | X | X | [開啟](./Chapter_2_教材.md) |

## 跨章節知識關聯圖

(一張 Mermaid graph，顯示各章知識點之間的關聯)

## 全科考前必背清單

(從所有章節的速記表中精選最重要的 10-15 項)
```

---

## 練習題規範 (Practice Questions)

### 出題核心理念

練習題的**主要目標不是測驗記憶，而是讓學生透過有挑戰性的題目來熟練概念的各種應用情境**。題目應迫使學生「動腦思考」而非「套公式填答」。好的題目會設計成：

- 需要先判斷使用哪個概念/公式（而非直接告訴你）
- 需要結合多個子觀念才能完成解題
- 包含看似合理但邏輯上有瑕疵的選項（考驗辨別力）

### 規範表

| 項目 | 規範 |
|:---|:---|
| **難度** | 以 **Medium-Hard 為主**（概念應用 + 情境變化），偏重「能否靈活運用」而非「有沒有背起來」 |
| **題型** | 混合：選擇題、計算題、簡答題、判斷題（True/False 需說明理由） |
| **數量** | 每知識點 2-3 題 |
| **答案** | 嚴禁直接放在題目下方或使用 `<details>`；必須統一置於文末獨立「解答與詳細解析專區」，題目下方僅放跳轉連結，確保自我測驗無劇透 |
| **標籤** | 每題標註 `[Easy]` / `[Medium]` / `[Hard]` |
| **陷阱設計** | 至少 1 題包含常見錯誤選項或易混淆觀念，解析中必須說明「為什麼這個錯誤選項看起來合理」 |
| **範圍限制** | 嚴格限定在該知識點內，不超綱 |
| **防幻覺** | 數值計算題必須先自行驗算，確保答案正確 |
| **應用導向** | 優先出「需要判斷情境、選擇方法、跨步驟推理」的題目，避免純記憶或直接套公式的題目 |

---

## 與其他 Skills 的整合

> Mock Exam Generator 和 Question Sweeper 皆為**通用設計**，完全支援統計學、微積分等學術科目。
> Mock Exam Generator 內建理工/數學類的詳解規範（列步驟、標公式、標陷阱），與本 Skill 產出的教材結構高度相容。

- **Mock Exam Generator**：教材產出後，可建議使用者觸發 Mock Exam Generator 從教材中出一份模擬考卷。教材中的知識點結構與知識樹可直接作為出題的範圍依據，讓 Mock Exam Generator 出題時不遺漏任何考點。
- **Question Sweeper**：教材中每章的知識點清單可作為 Question Sweeper 的掃題章節依據。掃題時優先以教材中標記為 `[Hard]` 或含陷阱的知識點作為加強方向。
- **Review Dashboard**：速記表與考試陷阱可同步整理至 `./Review_Dashboard/` 供考前快速複習。

完成所有教材輸出後，主動提示使用者：
> 「教材已全部產生完畢！你可以：
>
> 1. 使用 **Mock Exam Generator** 從教材範圍出一份模擬考（直接說「幫我出統計學模擬考」即可）
> 2. 使用 **Question Sweeper** 逐章掃題確認熟練度（說「幫我掃題 Chapter 1」即可）
> 3. 直接開始閱讀教材複習」

---

## 品質檢查清單 (Self-Check)

在輸出每份教材前，AI 必須自我檢查：

- [ ] 知識樹是否完整涵蓋原始檔案的所有主題？
- [ ] 每個知識點都有「核心概念 + 公式 + 觀念提醒 + 範例 + 練習題」五個區塊？
- [ ] 練習題的答案是否經過驗算？
- [ ] 跨章節關聯是否正確標註？
- [ ] 速記表是否精簡且準確？
- [ ] 考試陷阱是否基於真實常見錯誤？
- [ ] Mermaid 語法是否正確（無特殊字元未轉義）？
- [ ] 所有路徑皆為相對路徑？
