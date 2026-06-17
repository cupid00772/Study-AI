# 國立臺灣聯合大學系統 114學年度 微積分 模擬試題 解答卷 (Answers 3)

**難易度分佈：** 包含 [Easy], [Medium] 標籤。本卷特別針對 **Ratio Test的觀念釐清** 以及 **Lagrange乘子法的代數計算** 進行打擊加強。

---

### 甲、填充題：共 2 題，每題 20 分，共 40 分。

**1. Answer: `4`**
- **難度：** [Easy]
- **核心概念：** Ratio Test (比值審斂法) 與 收斂半徑。
- **解題步驟：**
  令 $a_n = \frac{n^2 (x-3)^n}{4^n}$。
  $\lim_{n \to \infty} \left| \frac{a_{n+1}}{a_n} \right| = \lim_{n \to \infty} \left| \frac{(n+1)^2 (x-3)^{n+1}}{4^{n+1}} \cdot \frac{4^n}{n^2 (x-3)^n} \right| = \lim_{n \to \infty} \frac{(n+1)^2}{n^2} \frac{|x-3|}{4} = \frac{|x-3|}{4}$。
  為使級數收斂，極限值需小於 1，即 $\frac{|x-3|}{4} < 1 \Rightarrow |x-3| < 4$。
  因此收斂半徑 $R = 4$。

**2. Answer: `7/10`**
- **難度：** [Medium]
- **核心概念：** Green's Theorem (格林定理)。
- **解題步驟：**
  $P = e^{x^2} + y^2$, $Q = 3x + \ln(y^2+1)$。
  $\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} = 3 - 2y$。
  利用格林定理轉換為二重積分： $\iint_D (3 - 2y) dA$。
  積分區域 $D$ 由 $y = \sqrt{x}$ 與 $y = x^2$ 圍成。交點為 $(0,0)$ 與 $(1,1)$。
  $\int_0^1 \int_{x^2}^{\sqrt{x}} (3 - 2y) dy dx = \int_0^1 \left[ 3y - y^2 \right]_{x^2}^{\sqrt{x}} dx$
  $= \int_0^1 (3\sqrt{x} - x - 3x^2 + x^4) dx$
  $= \left[ 3 \cdot \frac{2}{3} x^{3/2} - \frac{1}{2} x^2 - 3 \cdot \frac{1}{3} x^3 + \frac{1}{5} x^5 \right]_0^1$
  $= 2 - \frac{1}{2} - 1 + \frac{1}{5} = 1 - \frac{1}{2} + \frac{1}{5} = \frac{7}{10}$。

---

### 乙、計算、證明題：共 2 題，每題 30 分，共 60 分。

**1.** [Medium] (針對弱點：Ratio Test 極限判讀)
**解題步驟：**
(a) 令 $a_n = \frac{n!}{(2n)!} x^n$。
    $L = \lim_{n \to \infty} \left| \frac{a_{n+1}}{a_n} \right| = \lim_{n \to \infty} \left| \frac{(n+1)! x^{n+1}}{(2(n+1))!} \cdot \frac{(2n)!}{n! x^n} \right|$
    $= \lim_{n \to \infty} \left| \frac{(n+1) \cdot |x|}{(2n+2)(2n+1)} \right|$
    $= \lim_{n \to \infty} \frac{n+1}{4n^2+6n+2} |x| = 0$。
(b) 根據 Ratio Test，因為對任何實數 $x$，其極限值 $L = 0$ 恆小於 $1$ ($0 < 1$)。
    極限小於 1 代表該級數對任何實數 $x$ 都是**絕對收斂**的。
    既然對所有 $x$ 皆收斂，該冪級數的收斂半徑為無窮大，即 $R = \infty$。

**2.** [Medium] (針對弱點：Lagrange Multipliers 代數計算)
**解題步驟：**
1. 設目標函數 $f(x,y) = x^2 y$，限制條件 $g(x,y) = x^2 + y^2 = 3$。
2. 建立 Lagrange 方程式 $\nabla f = \lambda \nabla g$：
   - $\frac{\partial f}{\partial x} = 2xy = \lambda(2x) \quad \Rightarrow \quad 2x(y - \lambda) = 0 \quad \text{--- (1)}$
   - $\frac{\partial f}{\partial y} = x^2 = \lambda(2y) \quad \Rightarrow \quad x^2 = 2\lambda y \quad \text{--- (2)}$
3. 由 (1) 式可得兩種情況：$x = 0$ 或 $\lambda = y$。
4. **情況一：若 $x = 0$**
   代入限制條件 $x^2 + y^2 = 3 \Rightarrow 0 + y^2 = 3 \Rightarrow y = \pm \sqrt{3}$。
   得到兩個點 $(0, \sqrt{3})$ 與 $(0, -\sqrt{3})$。
   在此兩點上的函數值 $f(0, \pm\sqrt{3}) = 0$。
5. **情況二：若 $\lambda = y$**
   代入 (2) 式：$x^2 = 2(y)y \Rightarrow x^2 = 2y^2$。 (注意這裡正確取代數關係)
   再代回限制條件：$2y^2 + y^2 = 3 \Rightarrow 3y^2 = 3 \Rightarrow y^2 = 1 \Rightarrow y = \pm 1$。
   - 當 $y = 1$ 時，$x^2 = 2 \Rightarrow x = \pm \sqrt{2}$。
     得到點 $(\sqrt{2}, 1)$ 與 $(-\sqrt{2}, 1)$。
     函數值 $f(\pm\sqrt{2}, 1) = (\pm\sqrt{2})^2(1) = 2$。
   - 當 $y = -1$ 時，$x^2 = 2 \Rightarrow x = \pm \sqrt{2}$。
     得到點 $(\sqrt{2}, -1)$ 與 $(-\sqrt{2}, -1)$。
     函數值 $f(\pm\sqrt{2}, -1) = (\pm\sqrt{2})^2(-1) = -2$。
6. 比較所有得到的函數值 $(0, 2, -2)$：
   **Absolute maximum value is 2** (在點 $(\pm\sqrt{2}, 1)$)
   **Absolute minimum value is -2** (在點 $(\pm\sqrt{2}, -1)$)

---
### 配分建議與評分標準 (Marking Scheme)
- **甲、填充題 (40%)**：每題 20 分。
- **乙、計算、證明題 (60%)**：每題 30 分。
  - **題 1 (30%)**：(a) 正確算出極限 $L=0$ 得 15 分。(b) 邏輯清晰指出 $L<1$ 故絕對收斂，並答出 $R=\infty$ 得 15 分。
  - **題 2 (30%)**：列出 $\nabla f = \lambda \nabla g$ 得 5 分。正確分出 $x=0$ 與 $\lambda=y$ 兩條分支得 10 分。正確解出兩組分支下的點得 10 分。最終寫出極大極小值各 5 分。

---
> 💡 **考後檢討互動：**
> 第三回模擬考出爐囉！這次特別針對 Ratio Test 極限為 0 的觀念，以及拉格朗日乘子法的代換（這題的代換不會太複雜，請小心處理分支）出題。寫完後一樣來對答案，跟我說你這次的狀況如何！
