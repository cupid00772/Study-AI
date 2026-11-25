# 統計學 (上學期) — 課程核心教材與複習總覽

> 📅 最新更新：2026-11-25  
> 📂 來源目錄：`./Reference/NCU_Classes/統計學/上學期/`  
> 📄 共處理 7 份核心章節投影片 (Anderson 14e Metric Version: Chapter 1 ~ Chapter 7)  
> 🎯 目標：掌握核心概念、破除考試陷阱、衝刺期中與期末考高分！  

---

## 📚 章節教材目錄

| 章節編號 | 章節主題 | 核心知識點數 | 練習題數 | 教材連結 |
|:---|:---|:---:|:---:|:---|
| **Chapter 1** | **資料與統計學 (Data and Statistics)** | 8 個 | 12 題 | [開啟 Chapter 1 教材](./Chapter_1_教材.md) |
| **Chapter 2** | **敘述統計：表格與圖形呈現 (Tabular and Graphical Displays)** | 8 個 | 11 題 | [開啟 Chapter 2 教材](./Chapter_2_教材.md) |
| **Chapter 3** | **敘述統計：數值衡量指標 (Numerical Measures)** | 7 個 | 11 題 | [開啟 Chapter 3 教材](./Chapter_3_教材.md) |
| **Chapter 4** | **機率論入門 (Introduction to Probability)** | 5 個 | 10 題 | [開啟 Chapter 4 教材](./Chapter_4_教材.md) |
| **Chapter 5** | **離散機率分配 (Discrete Probability Distributions)** <br> *(期末考範圍 · [Chapter 5.pdf](./../../Reference/NCU_Classes/統計學/上學期/Chapter%205.pdf) 全 70 頁 / P.1~P.70)* | 7 個 | 13 題 | [開啟 Chapter 5 教材](./Chapter_5_教材.md) |
| **Chapter 6** | **連續機率分配 (Continuous Probability Distributions)** <br> *(期末考範圍 · [Chapter 6.pdf](./../../Reference/NCU_Classes/統計學/上學期/Chapter%206.pdf) 全 45 頁 / P.1~P.45)* | 6 個 | 13 題 | [開啟 Chapter 6 教材](./Chapter_6_教材.md) |
| **Chapter 7** | **抽樣與抽樣分配 (Sampling and Sampling Distributions)** <br> *(期末考範圍 · [Chapter 7.pdf](./../../Reference/NCU_Classes/統計學/上學期/Chapter%207.pdf) 全 53 頁 / P.1~P.53)* | 6 個 | 13 題 | [開啟 Chapter 7 教材](./Chapter_7_教材.md) |
| **總計** | **七大核心模組** | **47 個考點** | **83 題 (含詳解)** | — |

---

## 🗺️ 跨章節知識關聯圖 (Cross-Chapter Knowledge Map)

```mermaid
graph TD
    classDef ch1 fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef ch2 fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef ch3 fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef ch4 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    classDef ch5 fill:#fce4ec,stroke:#c2185b,stroke-width:2px;
    classDef ch6 fill:#e0f2f1,stroke:#00695c,stroke-width:2px;
    classDef ch7 fill:#ede7f6,stroke:#4527a0,stroke-width:2px;

    subgraph CH1["Chapter 1: 基礎資料結構與尺度"]
        D1["資料與尺度 (Scales)<br>Nominal / Ordinal / Interval / Ratio"]:::ch1
        D2["資料型態<br>Categorical vs. Quantitative"]:::ch1
        D3["抽樣與統計推論<br>Population (μ, σ) vs. Sample (x̄, s)"]:::ch1
    end

    subgraph CH2["Chapter 2: 表格與視覺化呈現"]
        G1["類別資料圖表<br>長條圖 (Separated) & 圓餅圖"]:::ch2
        G2["數量資料圖表<br>直方圖 (Touching) & 莖葉圖"]:::ch2
        G3["雙變數關聯與偏誤<br>散佈圖 & 辛普森悖論 (Simpson's Paradox)"]:::ch2
    end

    subgraph CH3["Chapter 3: 數值摘要指標"]
        N1["中心位置<br>Mean, Median (抗偏), 幾何平均 (複利)"]:::ch3
        N2["變異與離散<br>s² (除以 n-1), IQR, CV (相對變異)"]:::ch3
        N3["相對位置與極端值<br>z-Score, 柴比雪夫 (任意) vs. 經驗法則 (常態)"]:::ch3
        N4["雙變數線性指標<br>共變異數 s_xy & 相關係數 r_xy"]:::ch3
    end

    subgraph CH4["Chapter 4: 機率基礎與決策推論"]
        P1["試驗與計數<br>多步驟、組合 C(N,n)、排列 P(N,n)"]:::ch4
        P2["機率定律<br>加法定律 & 條件機率 P(A|B)"]:::ch4
        P3["獨立 vs. 互斥<br>非零機率下互斥必相依"]:::ch4
        P4["貝氏定理<br>先驗 + 新證據 (全機率) → 後驗機率"]:::ch4
    end

    subgraph CH5["Chapter 5: 離散機率分配與應用"]
        R1["隨機變數本質<br>離散 (計數) vs. 連續 (測量)"]:::ch5
        R2["機率質量函數與動差<br>E(X)=Σx f(x), Var(X)=E(X²)-μ²"]:::ch5
        R3["二元分配與共變異數<br>Cov(X, Y), 投資組合風險分散"]:::ch5
        R4["二項分配 Binomial<br>固定 n, 恆定 p, 獨立試驗, μ=np, σ²=np(1-p)"]:::ch5
        R5["卜瓦松分配 Poisson<br>時空區間稀有事件, μ=σ²"]:::ch5
        R6["超幾何分配 Hypergeometric<br>有限母體無放回, FPC 校正因子"]:::ch5
    end

    subgraph CH6["Chapter 6: 連續機率分配"]
        C1["連續 PDF 與面積即機率<br>P(X=c)=0, 總面積=1"]:::ch6
        C2["均勻分配 Uniform<br>f(x)=1/(b-a), E=(a+b)/2, Var=(b-a)²/12"]:::ch6
        C3["常態與標準常態 Normal<br>Z=(x-μ)/σ, 正向查表與逆向反求"]:::ch6
        C4["指數分配 Exponential<br>F(x)=1-e^(-x/μ), μ=σ, 偏度=2, 無記憶性"]:::ch6
    end

    subgraph CH7["Chapter 7: 抽樣與抽樣分配"]
        S1["抽樣與點估計<br>有限 vs. 無限母體, x̄→μ, s→σ, p̄→p"]:::ch7
        S2["樣本平均數 x̄ 抽樣分配與 CLT<br>E(x̄)=μ, σ_x̄=σ/√n (+FPC), n≥30 / n≥50"]:::ch7
        S3["樣本比例 p̄ 抽樣分配<br>E(p̄)=p, σ_p̄=√[p(1-p)/n], np≥5 & n(1-p)≥5"]:::ch7
    end

    %% Cross-chapter connections
    D2 -->|決定圖表呈現方式| G1
    D2 -->|決定圖表呈現方式| G2
    G2 -->|直方圖偏度 Skewness| N1
    G3 -->|散佈圖線性趨勢| N4
    D3 -->|點估計量原理| N1
    D3 -->|自由度 n-1 修正| N2
    N3 -->|z 分數標準化| P2
    P2 -->|條件機率與分割| P4
    P3 -->|聯合機率乘法| P4
    
    %% Chapter 4 to Chapter 5 connections
    D2 -->|定義變數性質| R1
    N1 -->|理論化為期望值| R2
    N2 -->|理論化為變異數| R2
    N4 -->|延伸至隨機變數關聯| R3
    P1 -->|組合數公式 C(n, x)| R4
    P1 -->|雙重組合數選樣| R6
    P3 -->|試驗獨立性前提| R4
    P3 -->|時空區間獨立性| R5
    R4 -->|無放回修正為超幾何| R6
    R6 -->|n/N ≤ 0.05 時逼近| R4

    %% Chapter 5 & 3 to Chapter 6 connections
    R1 -->|連續變數延伸| C1
    N3 -->|經驗法則與 z-Score| C3
    R5 -->|對偶互為倒數 μ=1/λ| C4

    %% Chapter 6 & 5 to Chapter 7 connections
    D3 -->|統計推論與母體一致| S1
    C2 -->|RAND 亂數抽樣| S1
    C3 -->|Z 表計算抽樣誤差機率| S2
    C3 -->|常態逼近計算比例誤差| S3
    R6 -->|5% 門檻與 FPC 校正| S2
    R4 -->|二項轉比例標準誤| S3

    %% 章節節點點擊跳轉事件
    click CH1 href "./Chapter_1_教材.md" "👉 開啟 Chapter 1 教材"
    click CH2 href "./Chapter_2_教材.md" "👉 開啟 Chapter 2 教材"
    click CH3 href "./Chapter_3_教材.md" "👉 開啟 Chapter 3 教材"
    click CH4 href "./Chapter_4_教材.md" "👉 開啟 Chapter 4 教材"
    click CH5 href "./Chapter_5_教材.md" "👉 開啟 Chapter 5 教材"
    click CH6 href "./Chapter_6_教材.md" "👉 開啟 Chapter 6 教材"
    click CH7 href "./Chapter_7_教材.md" "👉 開啟 Chapter 7 教材"
```

---

## ⚡ 全科考前必背精華清單 (Top 25 Must-Know Concepts & Formulas)

考前 30 分鐘必讀！精準鎖定考卷得分點：

1. **測量尺度四層次 (Nominal $\rightarrow$ Ordinal $\rightarrow$ Interval $\rightarrow$ Ratio)**：
   - 攝氏/華氏溫度是 **Interval**（無絕對零點，不可算倍數比率）。
   - 價格、所得、長度、年齡是 **Ratio**（有絕對零點，比值有意義）。
   - 郵遞區號、學號、性別代碼是 **Nominal**（純標籤，不能比大小、不能算平均）。

2. **長條圖 vs. 直方圖的外觀特徵**：
   - 長條圖（Bar Chart）：適用類別資料，條形間**有空隙（Separated）**。
   - 直方圖（Histogram）：適用數量資料，矩形間**緊密相接（Touching/No gap）**。

3. **偏度（Skewness）與均值拉扯關係**：
   - 尾巴在右 $\rightarrow$ **右偏（正偏）**：$\text{Mode} < \text{Median} < \text{Mean}$（均值被極端大值往右拉）。
   - 尾巴在左 $\rightarrow$ **左偏（負偏）**：$\text{Mean} < \text{Median} < \text{Mode}$（均值被極端小值往左拉）。

4. **辛普森悖論 (Simpson's Paradox)**：
   - 分組資料皆勝，但加總合併（Aggregated）後結論**完全反轉**！原因出在存在未控制的**干擾變數（Confounding Variable）**或樣本權重失衡。

5. **中位數 (Median) 與四分位距 (IQR) 的抗變性 (Resistant)**：
   - 當資料有極端值（Outliers）或嚴重偏態時，描述中心與離散首選 **Median** 與 **IQR**，而非 Mean 與 Standard Deviation。

6. **幾何平均數 ($\bar{x}_g$) 專攻成長率與複利**：
   - $\bar{x}_g = \sqrt[n]{(1+r_1)(1+r_2)\cdots(1+r_n)}$。
   - 算術平均數在此情境下會嚴重**高估**真實成長率！

7. **樣本變異數分母除以 $n-1$**：
   - $s^2 = \frac{\sum (x_i - \bar{x})^2}{n - 1}$（自由度 Degrees of Freedom，提供母體變異數 $\sigma^2$ 之不偏估計量）。

8. **變異係數 (Coefficient of Variation, CV)**：
   - $CV = \frac{s}{\bar{x}} \times 100\%$。**無單位**，專門用於比較「單位不同」或「均值差距極大」之相對波動風險。

9. **柴比雪夫定理 vs. 經驗法則**：
   - **柴比雪夫（適用任意分配）**：距離均值 $z$ 個標準差內至少有 $1 - \frac{1}{z^2}$ 的資料（$z=2 \implies \ge 75\%$；$z=3 \implies \ge 89\%$）。
   - **經驗法則（僅適用鐘形常態分配）**：$1\sigma \approx 68\%$，$2\sigma \approx 95\%$，$3\sigma \approx 99.7\%$。

10. **盒鬚圖極端值判別界限**：
    - $\text{Lower Limit} = Q_1 - 1.5(IQR)$；$\text{Upper Limit} = Q_3 + 1.5(IQR)$。
    - 鬚線（Whiskers）只能延伸到界限內最外側的**真實資料點**，超出界限者標示為 $*$。

11. **皮爾森相關係數 ($r$) 僅測量「線性」**：
    - $-1 \le r \le +1$。$r=0$ 僅代表**無線性關係**，不代表兩變數沒有其他非線性關係！且「相關不等於因果」。

12. **排列 (Permutation) vs. 組合 (Combination)**：
    - 順序重要（選職位、排順序）$\rightarrow P_n^N = \frac{N!}{(N-n)!}$。
    - 順序無關（選成員、抽樣品）$\rightarrow \binom{N}{n} = \frac{N!}{n!(N-n)!}$。

13. **互斥 (Mutually Exclusive) 與獨立 (Independent) 的生死區隔**：
    - 若 $P(A) > 0, P(B) > 0$：**互斥事件必定相依，絕不可能獨立！**
    - 互斥：$P(A \cap B) = 0$。
    - 獨立：$P(A|B) = P(A)$ 且 $P(A \cap B) = P(A)P(B)$。

14. **貝氏定理 (Bayes' Theorem) 表格化解題法**：
    $$P(A_j|B) = \frac{P(A_j)P(B|A_j)}{\sum P(A_i)P(B|A_i)}$$

15. **隨機變數期望值與變異數線性轉換**：
    - $E(aX + b) = aE(X) + b$。
    - $\text{Var}(aX + b) = a^2 \text{Var}(X)$（常數加項無變異，係數平方）。

16. **兩隨機變數差的變異數（必背不扣分）**：
    - $\text{Var}(X - Y) = \text{Var}(X) + \text{Var}(Y) - 2\text{Cov}(X, Y)$。
    - 若 $X$ 與 $Y$ 獨立，$\text{Var}(X - Y) = \text{Var}(X) + \text{Var}(Y)$（變異數永遠相加，絕不能相減！）。

17. **二項分配 (Binomial) 參數特徵**：
    - $f(x) = \binom{n}{x} p^x (1-p)^{n-x}$。
    - $\mu = np, \sigma^2 = np(1-p)$。
    - 當 $p = 0.5$ 時分配對稱且變異數最大。

18. **卜瓦松分配 (Poisson) 核心指紋**：
    - $f(x) = \frac{\mu^x e^{-\mu}}{x!}$。
    - **平均數等於變異數**：$E(X) = \text{Var}(X) = \mu$。
    - 注意區間時間長度縮放，零事件機率為 $P(X=0) = e^{-\mu}$。

19. **超幾何分配 (Hypergeometric) 與有限母體校正 (FPC)**：
    - 不放回抽樣，試驗相依且成功率變動。
    - $\text{Var}(X) = np(1-p) \left(\frac{N-n}{N-1}\right)$，因 $\text{FPC} < 1$，變異數必小於二項分配。

20. **二項逼近超幾何的判定門檻**：
    - 當抽樣比例 $\frac{n}{N} \le 0.05$ 時，母體不放回影響微小，可直接用二項分配替代計算。

21. **連續機率分配與均勻分配核心性質 (Chapter 6)**：
    - 連續變數單點機率恆為 $0$（$P(X=c)=0$），PDF 高度 $f(x)$ 可大於 $1$，僅需總面積為 $1$。
    - 均勻分配 $U(a, b)$：$E(X) = \frac{a+b}{2}$，$\text{Var}(X) = \frac{(b-a)^2}{12}$。

22. **常態分配標準化與逆向反求 (Chapter 6)**：
    - $z = \frac{x-\mu}{\sigma} \iff x = \mu + z\sigma$。
    - 逆向求「缺貨機率不超過 $\alpha$」的再訂購點時，左尾面積為 $1-\alpha$，整數解遇小數必**無條件進位**。

23. **指數分配與卜瓦松對偶關係 (Chapter 6)**：
    - 指數分配：$F(x_0) = P(X \le x_0) = 1 - e^{-x_0/\mu}$，$P(X > x_0) = e^{-x_0/\mu}$，**均值等於標準差（$\mu = \sigma$）**，偏度恆為 $2$。
    - 對偶轉換：先統一時間單位，再取倒數（$\mu_{\text{Exp}} = \frac{1}{\lambda_{\text{Poisson}}}$）。

24. **中央極限定理 (CLT) 與樣本平均數標準誤 (Chapter 7)**：
    - $E(\bar{x}) = \mu$；$\sigma_{\bar{x}} = \frac{\sigma}{\sqrt{n}}$（若有限母體且 $\frac{n}{N} > 0.05$，須乘 FPC $\sqrt{\frac{N-n}{N-1}}$）。
    - 常態母體下任意 $n$ 皆精確常態；非常態母體一般 $n \ge 30$（高度偏態或含極端值需 $n \ge 50$）。標準誤減半需 $4$ 倍樣本數！

25. **樣本比例 $\bar{p}$ 之抽樣分配與常態逼近雙門檻 (Chapter 7)**：
    - $E(\bar{p}) = p$；$\sigma_{\bar{p}} = \sqrt{\frac{p(1-p)}{n}}$（$\frac{n}{N} > 0.05$ 須乘 FPC）。
    - 常態逼近必檢驗兩條件：**$np \ge 5$ 且 $n(1-p) \ge 5$**，缺一不可！

---

## 🚀 後續複習行動指引

教材已全數備妥（Ch1 ~ Ch7），建議依照以下步調進行考前衝刺：

1. **快速閱讀**：花 50 分鐘依序瀏覽 [Chapter 1](./Chapter_1_教材.md) ~ [Chapter 7](./Chapter_7_教材.md) 的知識樹與重點速記表，確認概念脈絡清晰。
2. **實戰刷題**：遮住答案，親自練習每章教材中標註為 `[Medium]` 與 `[Hard]` 的練習題與考試陷阱題（期末考重點鎖定 Ch5 離散分配、Ch6 常態逆查與指數／卜瓦松對偶、Ch7 中央極限定理與 $\bar{x}/\bar{p}$ 有限母體校正 FPC）。
3. **出題模擬考 (Mock Exam)**：隨時向我發送指令：「**幫我出一份統計學模擬考**」，我會觸發 `Mock Exam Generator` 嚴格按照考試標準組卷並產出附帶步驟的解答卷！
