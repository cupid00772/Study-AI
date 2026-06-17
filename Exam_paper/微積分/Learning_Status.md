# 微積分 (Calculus) 學習狀態追蹤表

這份文件用於追蹤您在微積分各個章節的精熟程度。當 AI 產生新的模擬考卷時，會參考這份文件來針對您的弱點加強出題，同時避免重複出您已經熟悉的題目。

## 📊 整體學習狀態分析
- **目前重點加強章節**：極座標面積、極限特殊公式、多變數絕對極值 (有界區域)。
- **已掌握章節**：微積分基礎章節。

---

## 📚 章節精熟度清單

> **狀態標示**：
> 🟢 熟悉 (概念清楚、計算穩定)
> 🟡 尚可 (理解概念，但偶有粗心或計算失誤)
> 🔴 弱點 (觀念不熟、常遇到瓶頸或不知如何下筆)
> ⚪ 未測驗

| 章節 (Chapter) | 狀態 | 易錯觀念 / 常錯題型 | 已出過的考點紀錄 |
| :--- | :---: | :--- | :--- |
| **1. 極限與連續 (Limits and Continuity)** | 🟡 | 忘記斜漸近線 (Slant Asymptote) 的求法公式。 | Mock Exam A |
| **2. 導數與微分 (Derivatives and Differentiation)** | 🟢 | 計算偶有小粗心，但基本觀念清楚 | Sweep Exam |
| **3. 導數的應用 (Applications of Derivatives)** | 🟢 | 最佳化問題基本運算穩定 | Sweep Exam |
| **4. 積分 (Integrals)** | 🟢 | 基礎穩固，各式積分技巧皆能正確作答 | Sweep Exam |
| **5. 積分的應用 (Applications of Integrals)** | 🟡 | 弧長、旋轉曲面面積、質心公式需多複習記憶 | Mock Exam A |
| **6. 積分技巧 (Techniques of Integration)** | 🟢 | 基本計算熟練 | Sweep Exam |
| **7. 瑕積分 (Improper Integrals)** | 🟡 | 瑕積分收斂發散判斷 | Mock Exam A |
| **8. 數列與無窮級數 (Sequences and Series)** | 🔴 | 1. Ratio test 的絕對收斂判定。2. **忘記自然對數極限 $\lim (1+1/n)^n = e$**，常誤算為 $1$。 | Mock Exam A |
| **9. 參數方程式與極座標 (Parametric Eq. & Polar Coordinates)** | 🔴 | 計算極座標面積時，**上下限設定錯誤 (如將 $\pi/2$ 寫成 $\pi$)**，常忽略圖形的對稱性導致多算或少算。 | Mock Exam A |
| **10. 偏導數 (Partial Derivatives)** | 🟡 | 混和偏導數極限定義 | Mock Exam 2 |
| **11. 多變數函數的應用 (Applications of Partial Derivatives)** | 🔴 | 1. Lagrange 計算易失誤。2. **計算有界區域極值時，忘記先求「內部臨界點」** (如 Mock A 忘記比較 $f(0, -1/3)$ 的值)。 | Mock Exam A |
| **12. 多重積分 (Multiple Integrals)** | 🟡 | 球座標與柱座標的轉換需謹慎 | Mock Exam A |
| **13. 向量微積分 (Vector Calculus)** | 🔴 | Stokes' 與 Divergence Theorem 的適用時機與曲面法向量選取 | Mock Exam A |

---

## 📝 歷次測驗檢討紀錄

### [Mock Exam A]
- **測驗日期**：2026-06-15
- **檢討與反思**：
  - **極座標面積**：圖形的上下限設定出錯 (將 $\pi/2$ 寫成 $\pi$)。需加強繪圖並利用對稱性確認積分範圍，尤其是葉形線或蝸牛線。
  - **級數與極限**：極限公式 $\lim (1+1/n)^n = e$ 忘記，寫成了 $1$。對於 $1^\infty$ 形式的不定型需要用 $\ln$ 轉換或背熟公式。
  - **多變數極值**：在求有界區域絕對極大極小值時，只計算了邊界，完全**忘記計算內部臨界點**的數值進行比較。這是致命失誤。
