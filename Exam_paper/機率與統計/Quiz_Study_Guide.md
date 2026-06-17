# 機率與統計 小考精華指引 (Quiz Study Guide)

針對你即將在 **2026年6月11日 (四)** 進行的小考，考試範圍涵蓋 Chapter 2.5 - 2.6 以及 Chapter 4.1 - 4.4。本指引為你濃縮整理了其中最核心的**離散型隨機變數 (Discrete Random Variables)** 觀念，幫助你快速掌握並精通小考必備知識。

---

## 核心觀念一：聯合離散隨機變數 (Joint Discrete Random Variables) (Ch 2.5 - 2.6)

當探討兩個或以上的隨機變數同時發生時，我們使用**聯合機率質量函數 (Joint PMF)**。

*   **定義**: $P_{X,Y}(x, y) = P(X = x, Y = y)$
*   **邊際機率 (Marginal PMF)**:
    *   $P_X(x) = \sum_y P_{X,Y}(x, y)$
    *   $P_Y(y) = \sum_x P_{X,Y}(x, y)$
*   **獨立性 (Independence)**: 如果 $X$ 和 $Y$ 獨立，則對所有 $x, y$ 都有 $P_{X,Y}(x, y) = P_X(x)P_Y(y)$。
*   **期望值性質**: $E[X+Y] = E[X] + E[Y]$ (不論是否獨立)。如果獨立，則 $E[XY] = E[X]E[Y]$ 且 $Var(X+Y) = Var(X) + Var(Y)$。

---

## 核心觀念二：二項式分佈 (Binomial Distribution) (Ch 4)

用於描述進行 $n$ 次**獨立且相同**的白努利試驗 (Bernoulli trials)，每次成功機率為 $p$ 時，總共「成功」的次數 $X$。

*   **記法**: $X \sim Bin(n, p)$
*   **PMF (機率質量函數)**: 
    $$P(X = x) = \binom{n}{x} p^x (1-p)^{n-x}, \quad x = 0, 1, ..., n$$
*   **期望值 (Mean)**: $E[X] = np$
*   **變異數 (Variance)**: $Var(X) = np(1-p)$
*   **關鍵考點**: 題目會給定固定的試驗次數 $n$ 以及固定的成功率 $p$，要求計算特定成功次數的機率。

---

## 核心觀念三：幾何分佈 (Geometric Distribution) (Ch 4)

用於描述在獨立的白努利試驗中，為了得到**「第一次」成功**，所需要進行的總試驗次數 $X$。

*   **記法**: $X \sim Geo(p)$
*   **PMF**: 
    $$P(X = x) = (1-p)^{x-1}p, \quad x = 1, 2, 3, ...$$
    *(注意：有些課本定義 $X$ 為第一次成功前的「失敗次數」，則 $x$ 從 0 開始。這裡採用講義中提及總試驗次數的定義)*
*   **期望值 (Mean)**: $E[X] = \frac{1}{p}$
*   **變異數 (Variance)**: $Var(X) = \frac{1-p}{p^2}$
*   **關鍵考點**: 具有**無記憶性 (Memoryless property)**：$P(X > s + t \mid X > s) = P(X > t)$。

---

## 核心觀念四：卜瓦松分佈 (Poisson Distribution) (Ch 4)

用於描述在一段**固定時間或空間區間**內，某隨機事件發生的次數 $X$。通常用於稀有事件，或作為 $n$ 很大、$p$ 很小之二項式分佈的近似。

*   **記法**: $X \sim Poisson(\lambda)$，其中 $\lambda$ 為該區間內的平均發生次數。
*   **PMF**: 
    $$P(X = x) = \frac{e^{-\lambda} \lambda^x}{x!}, \quad x = 0, 1, 2, ...$$
*   **期望值 (Mean)**: $E[X] = \lambda$
*   **變異數 (Variance)**: $Var(X) = \lambda$ (卜瓦松分佈的特色是期望值等於變異數！)
*   **關鍵考點 (近似二項式)**: 當 $n \to \infty, p \to 0$ 且 $\lambda = np$ 時，Binomial 可以用 Poisson 近似：
    $$\binom{n}{x} p^x (1-p)^{n-x} \approx \frac{e^{-np} (np)^x}{x!}$$

---

## 準備建議

1. **認清題型特徵**：
   - 看到「固定次數 n」且問「成功 x 次」 $\rightarrow$ **二項式**
   - 看到「直到第一次成功」 $\rightarrow$ **幾何分佈**
   - 看到「單位時間/面積內發生次數」或「大 n 小 p」 $\rightarrow$ **卜瓦松分佈**
2. **熟悉公式變形**：切記 $\binom{n}{x}$ 的展開與階乘計算技巧。
3. **區分 Mean 和 Variance**：考題常會先要求你計算期望值與變異數，再代入其他機率運算中。

準備好後，我們就可以開始進行模擬考了！
