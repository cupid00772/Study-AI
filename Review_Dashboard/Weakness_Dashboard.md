# 🎯 考前弱點總整理與突破策略 (Weakness Dashboard)

這份文件為你統整了目前在 **微積分** 與 **計算機概論** 兩大科目中，尚未完全掌握的核心弱點（🔴）與容易粗心的部分（🟡）。請在考前針對這些重點進行最後衝刺！

---

## 📊 科目弱點比較表 (Weakness Comparison Chart)

| 科目 (Subject) | 領域 / 章節 | 狀態 | 具體盲點與易錯概念 (Pitfalls) | 突破重點 / 記憶口訣 |
| :--- | :--- | :---: | :--- | :--- |
| **微積分** | 積分的應用 | 🔴 | 弧長計算易失誤；忘記旋轉曲面面積 ($S = \int 2\pi y ds$) 與質心公式。 | 考前默寫面積、體積、質心三大公式。 |
| **微積分** | 瑕積分 | 🔴 | $\arcsin(x)$ 主值範圍；發散時誤以為正負無限大可相消；對數運算極限誤用。 | 瑕積分務必「拆開兩邊」算極限，不可直接相消。 |
| **微積分** | 數列與無窮級數 | 🔴 | 數列/級數收斂搞混；Ratio test 極限 <1 為絕對收斂；Maclaurin series 展開背錯。 | 區分 Sequence (項) 與 Series (總和)。背熟 $\ln(1+x)$。 |
| **微積分** | 多變數函數應用 | 🔴 | Lagrange 計算易失誤；梯度求方向導數忘記標準化為單位向量；指數常數大小比較。 | 方向導數公式：$\nabla f \cdot \hat{u}$ (記得除以長度)。 |
| **微積分** | 多重積分 | 🔴 | 空間積分易混淆 $r^2$ 與 $\rho^2$；變數代換 (Jacobian) 與極座標上下限不熟。 | 球座標體積元素：$\rho^2 \sin\phi \, d\rho \, d\phi \, d\theta$。 |
| **微積分** | 向量微積分 | 🔴 | 混淆 Stokes' 與 Divergence Theorem；面積分投影 $dA$ 轉換搞混。 | 曲線邊界 $\leftrightarrow$ 面積 (Stokes)；封閉曲面 $\leftrightarrow$ 體積 (Divergence)。 |
| **微積分** | 極限與連續 | 🟡 | 忘記斜漸近線 (Slant Asymptote) 求法：$m = \lim \frac{f(x)}{x}$。 | 多項式除法也是求斜漸近線的好方法。 |
| **微積分** | 偏導數 | 🟡 | 混和偏導數極限定義出錯，忽略 Clairaut's Theorem 的不成立條件。 | 確認偏導數是否「連續」再套用 Clairaut's。 |
| **計算機概論** | 演算法 (P vs NP) | 🔴 | 未釐清 P ≠ NP 推論：若 P ≠ NP，則「沒有任何」NP-complete 能在多項式時間解決。 | 只要一個 NPC 被快速解決，世界就變成 P = NP 了。 |
| **計算機概論** | 網路原理 | 🔴 | 忘記 Subnetting 的 Network ID 計算方式。 | 公式：**IP Address AND Subnet Mask**。 |
| **計算機概論** | 計算機組織 | 🔴 | IEEE 754 浮點數：Exponent 全為 1 時的兩種特殊值判斷。 | Fraction $=0$ (無限大)，Fraction $\neq 0$ (NaN)。 |
| **計算機概論** | 程式設計 (C++) | 🔴 | 建構/解構子呼叫順序；忘記父類別解構子沒加 `virtual` 會導致 Memory Leak。 | 建構先父後子，解構先子後父。多型必加 `virtual` 解構子。 |
| **計算機概論** | 程式設計 (C++) | 🔴 | `virtual` 關鍵字不熟，不了解動態綁定 (Dynamic Binding) / 多型。 | `virtual` 讓編譯器在執行時(Run-time)查表決定呼叫誰。 |
| **計算機概論** | 演算法 (圖論) | 🔴 | Dijkstra 搭配 Min-Heap 的時間複雜度。 | 複雜度：$O((V+E)\log V)$ 或 $O(E\log V)$。 |

---

## 📈 總結與後續行動建議

### 1. 📐 微積分 (Calculus)
微積分的弱點主要集中在 **「公式記憶」** (質心、Maclaurin 展開、球座標、三大向量定理) 以及 **「極限與收斂的觀念區分」**。
👉 **行動建議**：建議考前製作一張專屬的「一頁公式大抄」，每天默寫一次 Stokes' / Divergence Theorem 以及 Maclaurin 級數。

### 2. 💻 計算機概論 (Computer Science)
計算機概論的弱點比較零散，但具有極高的 **「記憶性與陷阱性」**，特別是 C++ 的 OOP 概念 (Virtual, Destructor) 與 IEEE 754 規格。
👉 **行動建議**：你剛剛已經在 IDE 中實作 `Heritance2.cpp` 測試了 `virtual` 的效果，這是非常好的習慣！繼續多寫短程式碼來驗證指標與多型的關係。對於網路與演算法，只需記住核心口訣 (AND 運算、$O(E \log V)$)。

> 💡 **Tip**: 當這些弱點都轉為綠燈 🟢 後，你就能在台聯大轉學考中穩穩拿下高分了！這份文件會隨著你的學習進度即時更新。
